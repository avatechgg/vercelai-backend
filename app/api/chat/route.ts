// import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

// import { auth } from '@/auth'
// import { nanoid } from '@/lib/utils'

export const runtime = 'edge'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, apiKey } = json

  // const userId = (await auth())?.user.id
  // const configuration = new Configuration({
  //   apiKey: apiKey
  // })

  // console.log(apiKey)

  // const openai = new OpenAIApi(configuration)
  // if (!userId) {
  //   return new Response('Unauthorized', {
  //     status: 401
  //   })
  // }

  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.7,
    stream: true
  })
  // console.log(await res.ok, res.body)

  const stream = OpenAIStream(res, {
    // async onCompletion(completion) {
    //   const title = json.messages[0].content.substring(0, 100)
    //   const id = json.id ?? nanoid()
    //   const createdAt = Date.now()
    //   const path = `/chat/${id}`
    //   const payload = {
    //     id,
    //     title,
    //     userId,
    //     createdAt,
    //     path,
    //     messages: [
    //       ...messages,
    //       {
    //         content: completion,
    //         role: 'assistant'
    //       }
    //     ]
    //   }
    //   await kv.hmset(`chat:${id}`, payload)
    //   await kv.zadd(`user:chat:${userId}`, {
    //     score: createdAt,
    //     member: `chat:${id}`
    //   })
    // }
  })

  return new StreamingTextResponse(stream, {
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers':
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    }
  })
}
