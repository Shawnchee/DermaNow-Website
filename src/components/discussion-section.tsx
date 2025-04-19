"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Send, MessageSquare, ThumbsUp, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import supabase from "@/utils/supabase/client"

interface Discussion {
  id: number
  project_id: string
  user_address: string
  user_name: string
  content: string
  created_at: string
  likes: number
}

export default function DiscussionSection({
  walletAddress,
  projectId: propProjectId,
}: {
  walletAddress: string
  projectId?: string
}) {
  const params = useParams()
  const projectId = propProjectId || (params.id as string) || "1"

  // State declarations
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [newComment, setNewComment] = useState("")
  const [userName, setUserName] = useState("Anonymous User")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch discussions
  useEffect(() => {
    const fetchData = async () => {
      if (projectId) {
        try {
          setIsLoading(true)
          const { data, error } = await supabase
            .from("project_discussions")
            .select("*")
            .eq("project_id", projectId)
            .order("created_at", { ascending: false })

          if (error) throw error
          setDiscussions(data || [])
        } catch (err) {
          console.error("Error fetching discussions:", err)
          toast.error("Failed to load discussions")
          setDiscussions([])
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchData()
  }, [projectId])

  // Fetch/set username
  useEffect(() => {
    console.log("Wallet Address:", walletAddress); // Debugging step
    const fetchUserProfile = async () => {
      if (!walletAddress) return;
  
      const { data, error } = await supabase
        .from("users")
        .select("name")
        .eq("wallet_address", walletAddress.toLowerCase())
        .single();
  
      if (data?.name) {
        setUserName(data.name);
      } else {
        setUserName(`User ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`);
      }
    };
  
    fetchUserProfile();
  }, [walletAddress]);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !walletAddress) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("project_discussions").insert([{
        project_id: projectId,
        user_address: walletAddress.toLowerCase(),
        user_name: userName,
        content: newComment,
        likes: 0,
      }])

      if (error) throw error

      setNewComment("")
      setDiscussions([{
        id: Date.now(), // Temporary ID for local display
        project_id: projectId,
        user_address: walletAddress,
        user_name: userName,
        content: newComment,
        likes: 0,
        created_at: new Date().toISOString(),
      }, ...discussions])
      
      toast.success("Comment posted successfully")
    } catch (err) {
      console.error("Error posting comment:", err)
      toast.error("Failed to post comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeDiscussion = async (discussionId: number) => {
    if (!walletAddress) return

    try {
      const discussion = discussions.find(d => d.id === discussionId)
      if (!discussion) return

      const { error } = await supabase
        .from("project_discussions")
        .update({ likes: discussion.likes + 1 })
        .eq("id", discussionId)

      if (!error) {
        setDiscussions(discussions.map(d => 
          d.id === discussionId ? { ...d, likes: d.likes + 1 } : d
        ))
      }
    } catch (err) {
      console.error("Error liking comment:", err)
    }
  }

  // Keep your existing JSX return statement here
  // (The rendering part remains unchanged from your original code)
  return (
    <div className="mb-12">
      <Card className="bg-white/90 backdrop-blur-sm border border-blue-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Project Discussions
          </CardTitle>
        </CardHeader>
  
        <CardContent>
          {/* Comment input area */}
          <div className="mb-6">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarFallback className="bg-blue-100 text-blue-800">
                  {userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
                <AvatarImage src={`https://avatars.dicebear.com/api/identicon/${walletAddress}.svg`} />
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Share your thoughts about this project..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-2 resize-none"
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={isSubmitting || !walletAddress}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>Posting...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Post Comment
                      </>
                    )}
                  </Button>
                </div>
                {!walletAddress && (
                  <p className="text-sm text-amber-600 mt-2">
                    Please connect your wallet to join the discussion
                  </p>
                )}
              </div>
            </div>
          </div>
  
          <Separator className="my-4" />
  
          {/* Discussion list */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : discussions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No discussions yet. Be the first to comment!</p>
              </div>
            ) : (
              discussions.map((discussion) => (
                <div key={discussion.id} className="flex gap-3 pb-4">
                  <Avatar className="h-10 w-10 border">
                    <AvatarFallback className="bg-blue-100 text-blue-800">
                      {discussion.user_name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                    <AvatarImage src={`https://avatars.dicebear.com/api/identicon/${discussion.user_address}.svg`} />
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{discussion.user_name}</p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-800">{discussion.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-1 ml-2">
                      <button
                        onClick={() => handleLikeDiscussion(discussion.id)}
                        className="flex items-center text-xs text-gray-500 hover:text-blue-600"
                      >
                        <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                        {discussion.likes > 0 ? discussion.likes : "Like"}
                      </button>
                      <button
                        onClick={() => toast.info("Report submitted. Our team will review it.")}
                        className="flex items-center text-xs text-gray-500 hover:text-red-600"
                      >
                        <Flag className="h-3.5 w-3.5 mr-1" />
                        Report
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )}