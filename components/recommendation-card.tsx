import { Star, CheckCircle } from "lucide-react"

interface RecommendationCardProps {
  title: string
  reason: string
  savings: number
  qualityRating: number
}

export function RecommendationCard({ title, reason, savings, qualityRating }: RecommendationCardProps) {
  return (
    <div className="rounded-lg border border-green-500/50 bg-green-50 dark:bg-green-950/30 p-4">
      <div className="flex items-start gap-3">
        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{title}</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{reason}</p>
          <div className="flex items-center gap-4">
            {savings > 0 && (
              <div className="text-sm">
                <span className="font-semibold text-green-600 dark:text-green-400">Save ${savings.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < qualityRating ? "fill-yellow-400 text-yellow-400" : "text-slate-300 dark:text-slate-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
