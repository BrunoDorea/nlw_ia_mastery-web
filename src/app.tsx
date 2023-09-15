import { Label } from "./components/ui/label"
import { Button } from "./components/ui/button"
import { Textarea } from "./components/ui/textarea"
import { Separator } from "./components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Github, Wand2, Upload, Video } from 'lucide-react'
import { Slider } from "./components/ui/slider"
import { VideoInputForm } from "./components/video-input-form"
import { PromptSelect } from "./components/prompt-select"
import { useState } from 'react'
import { useCompletion } from 'ai/react'
import { Switch } from "./components/ui/switch"

type Theme = 'light' | 'dark'

export function App() {
  const [temperature, setTemperature] = useState(0.4)
  const [videoId, setVideoId] = useState<string | null>(null)

  const [theme, setTheme] = useState<Theme>('dark')
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  function handlePromptSelected(template: string) {
    console.log(template)
  }

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: 'http://localhost:3333/ai/complete',
    body: {
      videoId,
      temperature,
    },
    headers: {
      'content-type': 'application/json'
    }
  })

  return (
    <div className={`min-h-screen flex flex-col bg-background ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Upload className="w-4 h-4 ml-2 text-primary"/>
          <h1 className="text-xl font-bold text-primary">upload.ai</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Desenvolvido com 💜 no NLW da Rocketseat
          </span>

          <Separator orientation="vertical" className="h-6"></Separator>

          <Switch onClick={toggleTheme} color="light" />

          <Separator orientation="vertical" className="h-6"></Separator>

          <Button variant="outline" >
            <Github className="w-4 h-4 mr-2 text-primary" />
            <a href="http://www.github.com/" target="_blank" className="text-primary">Github</a>
          </Button>
        </div>
      </div>

      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              className="resize-none p-4 leading-relaxed text-primary"
              placeholder="Inclua o prompt para a IA..."
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              className="resize-none p-4 leading-relaxed text-primary"
              placeholder="Resultado gerado pela IA..." readOnly
              value={completion}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável <code className="text-violet-400">{'{transcription}'}</code> no seu prompt para adicionar o conteúdo da transcrição do vídeo selecionado
          </p>
        </div>

        <aside className="w-80 space-y-6">
          <VideoInputForm onVideoUploaded={setVideoId} />

          <Separator />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-primary">
              <Label>Prompt</Label>
              <PromptSelect onPromptSelected={setInput} />
            </div>

            <div className="space-y-2 text-primary">
              <Label>Modelo</Label>
              <Select disabled defaultValue="gpt3.5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">Você poderá customizar está opção em breve</span>
            </div>

            <Separator />

            <div className="space-y-4 text-primary">
              <Label>Temperatura</Label>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={value => setTemperature(value[0])}
              />
              <span className="block text-xs text-muted-foreground italic leading-relaxed">
                Valores mais altos tendem a deixar o resultado mais criativo e com possíveis erros.
              </span>
            </div>

            <Separator />

            <Button disabled={isLoading} type="submit" className="w-full">
              Executar
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>

          </form>

        </aside>
      </main>
    </div>
  )
}
