
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  output: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ output: "Hello World" });
}
