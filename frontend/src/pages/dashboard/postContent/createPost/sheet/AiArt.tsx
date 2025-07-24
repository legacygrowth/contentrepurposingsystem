import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import axios from 'axios';

const AiArt = () => {
  const [userPrompt, setUserPrompt] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [outputQuality, setOutputQuality] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const openAiKey = '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';
  const replicateUrl = 'https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions';
  const replicateKey = 'Bearer r8_GMkINENZdE3DB33CM8wVxKEduaiZIwt1xqrrL';

  const generateAiPrompt = async () => {
    try {
      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `Generate an AI image prompt based on this input: ${userPrompt}`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${openAiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setAiPrompt(res.data.choices[0].message.content.trim());
    } catch (err) {
      console.error('Failed to generate prompt', err);
    }
  };

  const generateImage = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        replicateUrl,
        {
          input: {
            prompt: aiPrompt,
            aspect_ratio: aspectRatio,
            output_format: outputFormat,
            output_quality: outputQuality,
            safety_tolerance: 2,
            prompt_upsampling: true,
          },
        },
        {
          headers: {
            Authorization: replicateKey,
            'Content-Type': 'application/json',
            Prefer: 'wait',
          },
        }
      );
      if (res.data?.output && Array.isArray(res.data.output)) {
        setImageUrl(res.data.output[0]);
      } else {
        console.error('No image output returned from API', res.data);
      }
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="flex gap-2">
        <Input
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Enter image idea..."
        />
        <Button onClick={generateAiPrompt}>Generate Prompt</Button>
      </div>

      <div className="relative">
        <Textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="AI-generated prompt will appear here..."
          rows={4}
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={generateAiPrompt}
          className="absolute bottom-2 right-2"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Aspect Ratio</label>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="1:1">1:1</option>
            <option value="16:9">16:9</option>
            <option value="9:16">9:16</option>
            <option value="4:3">4:3</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Output Format</label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Output Quality</label>
          <select
            value={outputQuality}
            onChange={(e) => setOutputQuality(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="standard">Standard</option>
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <Button disabled={loading} onClick={generateImage} className="w-full">
        {loading ? 'Generating Image...' : 'Generate Image'}
      </Button>

      {/* Hardcoded Image Below Button */}
      <div className="mt-6">
       
        <img
          src="/dashboard/media-library/image4.jpg"
          alt="Sample"
          className="rounded border shadow-md w-200 h-80"
        />
      </div>

      {imageUrl && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Generated Image:</h3>
          <img
            src={imageUrl}
            alt="Generated Art"
            className="rounded border shadow-md w-full"
          />
        </div>
      )}
    </div>
  );
};

export default AiArt;
