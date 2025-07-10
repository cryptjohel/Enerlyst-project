"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm Enerlyst AI. I can help you with energy questions like 'What is kVA?' or 'How can I reduce diesel usage?'",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setLoading(false)
    }, 1000)
  }

  const getAIResponse = (question: string): string => {
    const q = question.toLowerCase()

    if (q.includes("kva") || q.includes("what is kva")) {
      return "kVA stands for kilovolt-ampere, which measures apparent power. It's the total power drawn by your generator, including both active power (kW) and reactive power. For diesel generators, 1 kVA ≈ 0.8 kW in real power output."
    }

    if (q.includes("system size") || q.includes("solar size")) {
      return "Solar system size depends on your daily energy consumption. Generally, you need 1.2-1.5 kW of solar panels for every 1 kWh of daily consumption. I can help calculate this if you share your appliance usage!"
    }

    if (q.includes("reduce diesel") || q.includes("diesel usage")) {
      return "To reduce diesel usage: 1) Switch to solar+battery systems, 2) Use energy-efficient appliances, 3) Optimize generator runtime, 4) Consider hybrid systems. Solar can reduce diesel costs by 70-90%!"
    }

    if (q.includes("battery") || q.includes("backup")) {
      return "Battery capacity should be 1.5-2x your daily energy consumption for 1-2 days backup. Lithium batteries are more efficient but costlier than lead-acid. Consider your budget and backup needs."
    }

    if (q.includes("cost") || q.includes("price") || q.includes("expensive")) {
      return "Solar systems typically cost ₦800,000-₦1,500,000 per kW installed. While initial cost is high, payback period is usually 3-5 years with diesel savings. Government incentives may be available!"
    }

    return "That's a great question! For detailed energy analysis, I recommend using our Diesel Calculator or Appliance Profiler tools. You can also book a consultation with our energy experts for personalized advice."
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#22C55E] hover:bg-[#16A34A] shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-xl z-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-[#22C55E] text-white rounded-t-lg">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bot className="h-4 w-4" />
          Enerlyst AI
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white hover:bg-white/20"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-80">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 text-sm ${
                    message.role === "user" ? "bg-[#22C55E] text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.role === "assistant" && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    {message.role === "user" && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="bg-gray-100 rounded-lg p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about energy optimization..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              size="icon"
              className="bg-[#22C55E] hover:bg-[#16A34A]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
