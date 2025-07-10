"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Mic, MicOff, Volume2, Loader2, Zap, CheckCircle } from "lucide-react"

interface VoiceAnalysis {
  appliances: Array<{
    name: string
    wattage: number
    quantity: number
    hoursPerDay: number
    confidence: number
  }>
  totalLoad: number
  insights: string[]
  transcript: string
}

export function VoiceApplianceInput({ onAnalysisComplete }: { onAnalysisComplete: (analysis: VoiceAnalysis) => void }) {
  const [isRecording, setIsRecording] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [analysis, setAnalysis] = useState<VoiceAnalysis | null>(null)
  const { toast } = useToast()
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" })
        processAudio(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      toast({
        title: "Recording started",
        description: "Describe your appliances and their usage patterns",
      })
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Please allow microphone access",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsAnalyzing(true)
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    // Simulate speech-to-text and AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock transcript
    const mockTranscript =
      "I have 5 LED bulbs that I use for about 6 hours daily, a refrigerator that runs 24/7, two ceiling fans used 8 hours per day, an air conditioner 1HP used 4 hours daily, and a television that runs about 5 hours per day. I also have a washing machine used twice a week for 2 hours each time."

    setTranscript(mockTranscript)

    // AI Analysis of the transcript
    const mockAnalysis: VoiceAnalysis = {
      appliances: [
        { name: "LED Bulb", wattage: 10, quantity: 5, hoursPerDay: 6, confidence: 95 },
        { name: "Refrigerator", wattage: 150, quantity: 1, hoursPerDay: 24, confidence: 98 },
        { name: "Ceiling Fan", wattage: 75, quantity: 2, hoursPerDay: 8, confidence: 92 },
        { name: "Air Conditioner (1HP)", wattage: 746, quantity: 1, hoursPerDay: 4, confidence: 96 },
        { name: "Television (LED)", wattage: 100, quantity: 1, hoursPerDay: 5, confidence: 90 },
        { name: "Washing Machine", wattage: 500, quantity: 1, hoursPerDay: 0.57, confidence: 85 }, // 4 hours/week = 0.57 hours/day
      ],
      totalLoad: 0,
      insights: [
        "Your air conditioner consumes 65% of your daily energy usage",
        "Consider upgrading to a 5-star rated AC to save 30% energy",
        "LED bulbs are energy efficient - great choice!",
        "Schedule washing machine during off-peak hours",
      ],
      transcript: mockTranscript,
    }

    // Calculate total load
    mockAnalysis.totalLoad = mockAnalysis.appliances.reduce(
      (total, app) => total + (app.wattage * app.quantity * app.hoursPerDay) / 1000,
      0,
    )

    setAnalysis(mockAnalysis)
    setIsAnalyzing(false)
    onAnalysisComplete(mockAnalysis)

    toast({
      title: "Analysis complete!",
      description: `Identified ${mockAnalysis.appliances.length} appliances from your description`,
    })
  }

  const playTranscript = () => {
    if ("speechSynthesis" in window && transcript) {
      const utterance = new SpeechSynthesisUtterance(transcript)
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-[#22C55E]" />
            Voice Appliance Input
          </CardTitle>
          <CardDescription>
            Describe your appliances and usage patterns - our AI will automatically analyze and categorize them
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isAnalyzing}
              className={`h-20 w-20 rounded-full ${
                isRecording ? "bg-red-500 hover:bg-red-600" : "bg-[#22C55E] hover:bg-[#16A34A]"
              }`}
              size="icon"
            >
              {isAnalyzing ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : isRecording ? (
                <MicOff className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
              {isAnalyzing
                ? "Analyzing your description..."
                : isRecording
                  ? "Recording... Click to stop"
                  : "Click to start recording"}
            </p>
          </div>

          {transcript && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Transcript</CardTitle>
                  <Button variant="ghost" size="sm" onClick={playTranscript}>
                    <Volume2 className="h-4 w-4 mr-1" />
                    Play
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{transcript}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#22C55E]" />
              AI Analysis Results
            </CardTitle>
            <CardDescription>Automatically detected appliances and usage patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {analysis.appliances.map((appliance, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{appliance.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {appliance.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {appliance.quantity}x • {appliance.wattage}W • {appliance.hoursPerDay.toFixed(1)}h/day
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-[#22C55E]" />
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#22C55E]/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-[#22C55E]" />
                <span className="font-medium">Total Daily Load</span>
              </div>
              <p className="text-2xl font-bold text-[#22C55E]">{analysis.totalLoad.toFixed(1)} kWh</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">AI Insights</h4>
              {analysis.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <Badge variant="secondary" className="mt-0.5 text-xs">
                    Tip {index + 1}
                  </Badge>
                  <p className="text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
