import type { NextApiRequest, NextApiResponse } from 'next';
const token = 'tfp_HMrdTRKvNCgaYcwsBhWv5omzuaJp5m9Xu1RRz2tZk4b5_3pf1RNNWSv5Nue';


// const getResponse = async (req:any) => {
//   const endPoint = `https://api.typeform.com/forms/${req.query.id}/responses`
//   const result = await fetch(`${endPoint}?included_response_ids=${req.query.response_id}`, {
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   });
//   return result;
// }

// const wait = async (ms: number) => {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms)
//   })
// }

// const api = async(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) => {
//    let result:any = {ok: false};
//    let counter = 1;
//    if(!result && counter<5)
//    {
//     console.log('counter',counter)
//     result = await getResponse(req)
//     console.log('result status',result)
//     await wait(5000)
//     counter +=1;
//    }
//    if(!result.ok)
//    {
//     return res.status(result.status).json({ message: result.statusText })
//    }

//    const data = await result.json();
//    const response = data.items[0];
//    if(!response)
//    {
//      return res.status(404).json({ message: 'response Not found' })
//    }


//   res.status(200).json(data)
// }

export default async function handler(req:any, res:any) {
  const result = await fetch(`https://api.typeform.com/forms/${req.query.id}/responses?included_response_ids=${req.query.response_id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if(!result.ok) {
    return res.status(result.status).json({message: result.statusText})
  }
  const data = await result.json();
  const response = data.items[0];
  if(!response)
  {
    return res.status(404).json({message: 'response not found'})
  }
  const answers = response.answers;
  res.status(200).json(answers);
}

// export default api;