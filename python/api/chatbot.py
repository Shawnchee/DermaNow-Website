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

2. **Non-Donation Queries**:
   - For general questions (e.g., "How does DermaNow work?"), give clear, concise answers about DermaNow’s mission or processes.
   - Do not call search_charities unless donation intent is clear.

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
            tools=[{"type": "function", "function": search_charities_function}],
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
                        # Update the arguments to reflect the fallback
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
                        # Take only the top result (or top N if desired, e.g., filtered_charities[:3])
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

            # Second completion with tool results
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                tools=[{"type": "function", "function": search_charities_function}],
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
