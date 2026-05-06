import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="glass rounded-2xl p-8 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo.png"
              alt="Jay's AI Playbook"
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>

          {/* Icon */}
          <div className="inline-flex p-4 rounded-full bg-primary/20 mb-6">
            <Mail className="h-8 w-8 text-primary" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
          <p className="text-muted-foreground mb-8">
            We&apos;ve sent you a confirmation link. Please check your email to verify your account and complete registration.
          </p>

          <div className="space-y-4">
            <Link href="/auth/login">
              <Button className="w-full gradient-primary text-primary-foreground border-0">
                Go to Login
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or try signing up again.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
