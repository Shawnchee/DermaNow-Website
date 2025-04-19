from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import json
from search.search_charities import search_charities
from dotenv import load_dotenv
import os

load_dotenv()

# Initialize FastAPI app
chatbot_app = FastAPI(title="DermaNow Chatbot API")

# Enable CORS
chatbot_app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# Pydantic models
class ChatRequest(BaseModel):
    message: str
    history: list[dict] | None = None


class ChatResponse(BaseModel):
    message: str
    donation_intent: bool
    charities: list | None = None


class DescriptionRequest(BaseModel):
    title: str
    user_instruction: str | None = None
    current_description: str | None = None


class DescriptionResponse(BaseModel):
    generated_description: str


# Function definition for OpenAI
search_charities_function = {
    "name": "search_charities",
    "description": "Search for Shariah-compliant charity projects on DermaNow based on a user query.",
    "parameters": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The user’s query describing the type of charity they want to support (e.g., 'education', 'kids'). Must not be empty.",
            }
        },
        "required": ["query"],
        "additionalProperties": False,
    },
}

fetch_dermanow_info_function = {
    "name": "fetch_dermanow_info",
    "description": "Fetch detailed information about the DermaNow platform, including its mission, blockchain usage, Shariah compliance, and functionalities.",
    "parameters": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The user’s query about DermaNow (e.g., 'What is DermaNow?', 'How does DermaNow work?'). Used to tailor the response if specific aspects are requested.",
            }
        },
        "required": ["query"],
        "additionalProperties": False,
    },
}


@chatbot_app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # Prepare messages with updated system prompt
        messages = [
            {
                "role": "system",
                "content": f"""
You are DermaBot, helping users learn about and donate to Shariah-compliant charity projects on DermaNow. Follow these guidelines:

1. **Scope**:
   - Only provide information about DermaNow and its listed charity projects.
   - Do not recommend external charities or platforms.
   - Politely decline questions unrelated to DermaNow.

2. **General DermaNow Queries**:
    - For questions about DermaNow (e.g., "What is DermaNow?", "How does it work?", "Tell me about blockchain or Shariah compliance"), call fetch_dermanow_info with the user’s query.
    - Present the response in a concise, engaging paragraph (150-200 words) summarizing DermaNow’s mission, blockchain usage, Shariah compliance, and key features (donations, staking, rewards).
    - If the query specifies an aspect (e.g., "How does blockchain work in DermaNow?"), tailor the response to focus on that aspect while briefly mentioning others.
    - End with a question like, "Want to explore more about DermaNow or its projects?"

3. **Donation Queries**:
   - If the user wants to donate (e.g., "I want to donate to kids"), extract the sentence and call search_charities with it.
   - The query must be a meaningful sentence derived from the user’s input.
   - If the query matches a project, present the top charity in a natural, engaging paragraph which contains:
     - Project title.
     - A brief, rephrased description (1-2 sentences, not verbatim).
     - Funding percentage.
     - Number of supporters.
     - Amount needed (MYR).
   - Exclude: image links, raw descriptions, or technical fields.
   - End with a question, e.g., "Would you like to support this project?"
   - If the top result returned by search_charities isn't relevant to the user's query, acknowledge and present it as a suggestion.

4. **Refined Donation Queries**:
   - If the user refines (e.g., "No, I want something for education"), call search_charities with the new query (e.g., "education").
   - Acknowledge naturally, then present the new top charity as above.
   - If the top result is still not relevant, acknowledge and suggest the top result as an alternative.

5. **Tone**:
   - Be friendly, empathetic, and professional.
   - Use simple, conversational language.
   - Vary responses to feel natural, avoiding repetitive phrases.

6. **Error Handling**:
   - If donation intent is detected but no specific cause is mentioned, use a default query like 'education/medical/food' for search_charities to give some suggestions.
   - Always prioritize trust and integrity; avoid speculation.
""",
            }
        ]

        # Sanitize history
        if request.history:
            sanitized_history = [
                msg
                for msg in request.history
                if msg.get("role") in ["user", "assistant"] and msg.get("content")
            ]
            messages.extend(sanitized_history)

        # Add user message
        messages.append({"role": "user", "content": request.message})

        # Initial completion request
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            tools=[
                {"type": "function", "function": search_charities_function},
                {"type": "function", "function": fetch_dermanow_info_function},
            ],
            tool_choice="auto",
        )

        message = response.choices[0].message
        donation_intent = False
        charities = None

        # Handle function calls
        if message.tool_calls:
            messages.append(
                {
                    "role": "assistant",
                    "content": message.content,
                    "tool_calls": [
                        {
                            "id": tool_call.id,
                            "type": "function",
                            "function": {
                                "name": tool_call.function.name,
                                "arguments": tool_call.function.arguments,
                            },
                        }
                        for tool_call in message.tool_calls
                    ],
                }
            )

            for tool_call in message.tool_calls:
                if tool_call.function.name == "search_charities":
                    donation_intent = True
                    args = json.loads(tool_call.function.arguments)
                    query = args.get("query")

                    # Fallback for empty query
                    if not query or query.strip() == "":
                        query = "charity"
                        args["query"] = query
                        messages[-1]["tool_calls"][0]["function"]["arguments"] = (
                            json.dumps(args)
                        )

                    # Log the query for debugging
                    print(f"Calling search_charities with query: {query}")

                    # Call search_charities
                    charities = search_charities(query)

                    # Filter out completed projects and limit to top result
                    if charities:
                        filtered_charities = [
                            charity
                            for charity in charities
                            if not charity.get("funding_complete", False)
                        ]
                        charities = filtered_charities[:1]

                    # Append tool result
                    messages.append(
                        {
                            "role": "tool",
                            "content": json.dumps(charities),
                            "tool_call_id": tool_call.id,
                        }
                    )

                    # If no results or low relevance, try a general search
                    if not charities or len(charities) == 0:
                        general_charities = search_charities("charity")
                        if general_charities:
                            filtered_general = [
                                charity
                                for charity in general_charities
                                if not charity.get("funding_complete", False)
                            ]
                            charities = filtered_general[:1]
                            messages[-1] = {
                                "role": "tool",
                                "content": json.dumps(charities),
                                "tool_call_id": tool_call.id,
                            }
                        else:
                            donation_intent = False
                            charities = None

                elif tool_call.function.name == "fetch_dermanow_info":
                    args = json.loads(tool_call.function.arguments)
                    query = args.get("query", request.message)

                    # Static DermaNow info based on the provided document
                    dermanow_info = {
                        "overview": """
DermaNow is Malaysia’s first Shariah-compliant, blockchain-powered charity platform, designed to make donations transparent, efficient, and aligned with Islamic financial ethics. It bridges the trust gap in charitable giving by using Ethereum blockchain to ensure donors can track how, where, and when their funds are used.
""",
                        "mission_vision": """
**Mission**: Create a Shariah-compliant ecosystem supporting Zakat, Sadaqah, Waqf, and Mudarabah, ensuring ethical and transparent fund use.
**Vision**: Revolutionize charity by addressing transparency issues, high intermediary costs, and limited donor engagement.
""",
                        "blockchain_usage": """
DermaNow uses Ethereum blockchain for:
- **Transparency**: All transactions are recorded on-chain, verifiable via Etherscan.
- **Milestone-Based Funding**: Funds are released only after verified milestones, reducing misuse.
- **Direct Payments**: Donations go directly to verified service providers (e.g., caterers, construction teams).
- **Security**: Smart contracts manage donations and staking, ensuring tamper-proof operations.
""",
                        "shariah_compliance": """
DermaNow ensures compliance with Islamic principles:
- **Ethical Guidelines**: Projects are vetted by Islamic authorities and an AI-powered compliance checker.
- **Halal Investments**: Staking uses Mudarabah-based profit-sharing, investing in ethical platforms like Firoza Finance and HAQQ Blockchain.
- **No Riba**: Returns are profit-based, not interest-based.
- **Amanah (Trust)**: 100% of donations go to projects with no deductions.
- **Periodic Reviews**: Shariah advisors regularly review the framework.
""",
                        "functionalities": """
Key features include:
- **Donations**: Browse verified projects, donate to milestones via local payments (e.g., Touch ‘n Go, converted to ETH), and generate tax relief receipts.
- **Staking**: Stake ETH in a halal pool for 2-5% annual rewards, with at least 20% donated to charity.
- **Rewards**: Earn points per RM donated, redeemable for vouchers, and progress through donor levels for NFTs and perks.
- **DermaBot**: AI chatbot guides users, suggests projects, and facilitates donations.
- **Transparency**: On-chain milestone tracking and DAO committee voting ensure accountability.
""",
                        "technical_architecture": """
- **Frontend**: Next.js, TailwindCSS, Shadcn/UI.
- **Backend**: Supabase (PostgreSQL), Python for AI/ML.
- **Blockchain**: Solidity smart contracts on Ethereum (Sepolia testnet for development).
- **AI**: OpenAI for DermaBot, Hugging Face for ML models.
- **Infrastructure**: Cloudflare, Infura, Docker.
""",
                    }

                    # Tailor response based on query focus (if specific)
                    response_content = dermanow_info["overview"]
                    if "mission" in query.lower() or "vision" in query.lower():
                        response_content += dermanow_info["mission_vision"]
                    elif "blockchain" in query.lower():
                        response_content += dermanow_info["blockchain_usage"]
                    elif "shariah" in query.lower() or "islamic" in query.lower():
                        response_content += dermanow_info["shariah_compliance"]
                    elif (
                        "function" in query.lower()
                        or "feature" in query.lower()
                        or "work" in query.lower()
                    ):
                        response_content += dermanow_info["functionalities"]
                    elif "tech" in query.lower() or "architecture" in query.lower():
                        response_content += dermanow_info["technical_architecture"]
                    else:
                        # General query, include a bit of everything
                        response_content += (
                            dermanow_info["mission_vision"]
                            + dermanow_info["blockchain_usage"]
                            + dermanow_info["shariah_compliance"]
                            + dermanow_info["functionalities"]
                        )

                    # Append tool result
                    messages.append(
                        {
                            "role": "tool",
                            "content": json.dumps({"info": response_content}),
                            "tool_call_id": tool_call.id,
                        }
                    )

            # Second completion with tool results
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                tools=[
                    {"type": "function", "function": search_charities_function},
                    {"type": "function", "function": fetch_dermanow_info_function},
                ],
                tool_choice="auto",
            )
            message = response.choices[0].message

        # Handle empty charities case
        if donation_intent and (not charities or len(charities) == 0):
            message.content = "I couldn’t find any projects right now. Could you try terms like 'education' or 'water'?"
            donation_intent = False
            charities = None

        return ChatResponse(
            message=message.content or "Could you clarify what you’re looking for?",
            donation_intent=donation_intent,
            charities=charities,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")


@chatbot_app.post("/generate-description", response_model=DescriptionResponse)
async def generate_description_endpoint(request: DescriptionRequest):
    try:
        # Prepare the prompt for OpenAI
        system_prompt = """
You are an assistant helping users create compelling descriptions for charity projects on DermaNow, a platform for Shariah-compliant charity projects. Your task is to generate or refine a project description based on the provided title, optional user instructions, and any existing description. Follow these guidelines:

1. **Tone**: Write in a professional, empathetic, and engaging tone that inspires trust and motivates donations.
2. **Content**: 
   - Ensure the description aligns with the project title.
   - If a current description is provided, incorporate its key points and improve clarity, structure, or impact.
   - Highlight the project's purpose, beneficiaries, and impact in 100-150 words.
   - Avoid jargon and keep language simple and accessible.
3. **Shariah Compliance**: Ensure the description reflects values consistent with Shariah-compliant charity (e.g., transparency, ethical fundraising).
4. **User Instructions**: 
   - If user instructions are provided, strictly follow them (e.g., "make it more emotional" or "focus on children").
   - If no instructions are provided, enhance the description freely, focusing on clarity, emotional appeal, and alignment with the title.
5. **Output**: Return only the generated description as plain text, without additional commentary.

If no current description is provided, create a new one from scratch based on the title and optional instructions.
"""

        # Construct the user prompt
        user_prompt = f"Project Title: {request.title}\n"
        user_prompt += f"User Instructions: {request.user_instruction if request.user_instruction else 'None'}\n"
        user_prompt += f"Current Description: {request.current_description if request.current_description else 'None'}\n"

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )

        generated_description = response.choices[0].message.content.strip()

        return DescriptionResponse(generated_description=generated_description)

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating description: {str(e)}"
        )
