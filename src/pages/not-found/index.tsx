import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center gap-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-[6rem] font-bold leading-none tracking-tight text-muted-foreground">404</h1>
        <p className="text-xl text-muted-foreground">页面未找到</p>
      </div>
      <div className="flex gap-3">
        <Link to="/">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            返回首页
          </Button>
        </Link>
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Button>
      </div>
    </div>
  )
}
