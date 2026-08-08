export async function speechToText(audioBase64: string): Promise<string|null> {
  const apiKey=process.env.DEEPGRAM_API_KEY; if(!apiKey)return null;
  try{const buf=Buffer.from(audioBase64,"base64");const r=await fetch("https://api.deepgram.com/v1/listen?model=nova-2&language=en-IN&punctuate=true",{method:"POST",headers:{Authorization:`Token ${apiKey}`,"Content-Type":"audio/webm"},body:buf});if(!r.ok)return null;const d=await r.json();return d.results?.channels?.[0]?.alternatives?.[0]?.transcript||null}catch{return null}
}
export async function textToSpeech(text: string, voiceId?: string, speed=1.0): Promise<string|null> {
  const apiKey=process.env.ELEVENLABS_API_KEY; if(!apiKey)return null;
  const vid=voiceId||process.env.ELEVENLABS_VOICE_ID||"21m00Tcm4TlvDq8ikWAM";
  try{const r=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vid}`,{method:"POST",headers:{"Content-Type":"application/json","xi-api-key":apiKey},body:JSON.stringify({text,model_id:"eleven_multilingual_v2",voice_settings:{stability:0.5,similarity_boost:0.75,speed}})});if(!r.ok)return null;const ab=await r.arrayBuffer();return Buffer.from(ab).toString("base64")}catch{return null}
}
export function shouldUseBrowserTTS(): boolean { return !process.env.ELEVENLABS_API_KEY; }
