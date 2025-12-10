import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ROUTE_PATHS } from '@/constants/common'

const loginSchema = z.object({
  email: z
    .string({ message: '请输入邮箱地址' })
    .min(1, '请输入邮箱地址')
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: '请输入有效的邮箱地址',
    }),
  password: z
    .string({ message: '请输入密码' })
    .min(1, '请输入密码')
})

type LoginFormValues = z.infer<typeof loginSchema>

const defaultValues: LoginFormValues = {
  email: '',
  password: '',
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  })
  const navigate = useNavigate()

  function onSubmit(values: LoginFormValues) {
    console.log(values)
    // TODO: 这里添加登录逻辑
    // 模拟登录成功后跳转到 dashboard
    navigate(ROUTE_PATHS.dashboard)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">登录您的账户</h1>
          <p className="text-muted-foreground text-sm text-balance">
            请在下方输入您的邮箱地址以登录您的账户
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="请输入邮箱地址"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="请输入密码"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">登录</Button>
      </form>
    </Form>
  )
}
