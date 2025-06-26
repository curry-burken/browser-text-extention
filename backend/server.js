import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.post('/proxyserver', async (req, res) => {
//   const { prompt } = req.body;

  try {
    const response = await fetch(process.env.REQ_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: "who is trump?" }] }
        ]
      })
    });

    const data = await response.json();
    res.json({ result: data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response." });
  } 
  catch (error) {
    console.log(error.message);
    res.status(500).json({ "Error": 'Gemini API failed', "Error Message":error.message });
  }
});

app.listen(PORT, () => {
  console.log(`server running`);
});
