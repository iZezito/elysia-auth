// import { Elysia } from 'elysia'
// import { AuthService } from './service'

// /**
//  * Middlewares específicos para diferentes níveis de autenticação
//  */

// /**
//  * Middleware que requer que o usuário seja administrador
//  */
// export const requireAdmin = new Elysia({ name: 'require-admin' })
//     .macro({
//         requireAdmin: {
//             beforeHandle({ user, status }) {
//                 if (!user) {
//                     return status(401, {
//                         success: false,
//                         error: 'Não autenticado',
//                         message: 'É necessário estar logado para acessar este recurso'
//                     })
//                 }

//                 if (!AuthService.isAdmin(user)) {
//                     return status(403, {
//                         success: false,
//                         error: 'Acesso negado',
//                         message: 'Apenas administradores podem acessar este recurso'
//                     })
//                 }
//             }
//         }
//     })

// /**
//  * Middleware para verificar se o usuário pode acessar um recurso específico
//  * baseado no ID do usuário
//  */
// export const requireOwnershipOrAdmin = new Elysia({ name: 'require-ownership-or-admin' })
//     .macro({
//         requireOwnershipOrAdmin(resourceUserIdParam: string = 'userId') {
//             return {
//                 beforeHandle({ user, params, status }) {
//                     if (!user) {
//                         return status(401, {
//                             success: false,
//                             error: 'Não autenticado',
//                             message: 'É necessário estar logado para acessar este recurso'
//                         })
//                     }

//                     const resourceUserId = parseInt(params[resourceUserIdParam])

//                     // Admin pode acessar qualquer recurso
//                     if (AuthService.isAdmin(user)) {
//                         return
//                     }

//                     // Usuário comum só pode acessar seus próprios recursos
//                     if (user.id !== resourceUserId) {
//                         return status(403, {
//                             success: false,
//                             error: 'Acesso negado',
//                             message: 'Você só pode acessar seus próprios recursos'
//                         })
//                     }
//                 }
//             }
//         }
//     })

// /**
//  * Middleware para rate limiting baseado no usuário
//  */
// export const rateLimitByUser = new Elysia({ name: 'rate-limit-by-user' })
//     .state('rateLimitStore', new Map<number, { count: number; resetTime: number }>())
//     .macro({
//         rateLimitByUser(maxRequests: number = 10, windowMs: number = 60000) {
//             return {
//                 beforeHandle({ user, store: { rateLimitStore }, status }) {
//                     if (!user) {
//                         // Para usuários não autenticados, aplicar rate limit mais restritivo
//                         return // Você pode implementar rate limit por IP aqui
//                     }

//                     const now = Date.now()
//                     const userLimit = rateLimitStore.get(user.id)

//                     if (!userLimit || now > userLimit.resetTime) {
//                         // Resetar contador
//                         rateLimitStore.set(user.id, {
//                             count: 1,
//                             resetTime: now + windowMs
//                         })
//                         return
//                     }

//                     if (userLimit.count >= maxRequests) {
//                         return status(429, {
//                             success: false,
//                             error: 'Rate limit excedido',
//                             message: `Muitas requisições. Limite: ${maxRequests} por ${windowMs/1000} segundos`,
//                             retryAfter: Math.ceil((userLimit.resetTime - now) / 1000)
//                         })
//                     }

//                     // Incrementar contador
//                     userLimit.count++
//                     rateLimitStore.set(user.id, userLimit)
//                 }
//             }
//         }
//     })

// /**
//  * Middleware para log de auditoria
//  */
// export const auditLog = new Elysia({ name: 'audit-log' })
//     .state('auditLogs', [] as Array<{
//         timestamp: Date
//         userId?: number
//         userEmail?: string
//         action: string
//         resource: string
//         ip?: string
//         userAgent?: string
//     }>())
//     .macro({
//         auditLog(action: string, resource: string) {
//             return {
//                 beforeHandle({ user, request, store: { auditLogs } }) {
//                     const logEntry = {
//                         timestamp: new Date(),
//                         userId: user?.id,
//                         userEmail: user?.email,
//                         action,
//                         resource,
//                         ip: request.headers.get('x-forwarded-for') || 'unknown',
//                         userAgent: request.headers.get('user-agent') || 'unknown'
//                     }

//                     auditLogs.push(logEntry)

//                     // Em produção, você salvaria isso em um banco de dados
//                     console.log('Audit Log:', logEntry)

//                     // Manter apenas os últimos 1000 logs em memória
//                     if (auditLogs.length > 1000) {
//                         auditLogs.splice(0, auditLogs.length - 1000)
//                     }
//                 }
//             }
//         }
//     })

// /**
//  * Middleware para verificar se a conta do usuário está ativa
//  */
// export const requireActiveUser = new Elysia({ name: 'require-active-user' })
//     .macro({
//         requireActiveUser: {
//             beforeHandle({ user, status }) {
//                 if (!user) {
//                     return status(401, {
//                         success: false,
//                         error: 'Não autenticado',
//                         message: 'É necessário estar logado para acessar este recurso'
//                     })
//                 }

//                 // Aqui você verificaria se a conta está ativa
//                 // Por exemplo, verificando um campo 'isActive' no usuário
//                 // if (!user.isActive) {
//                 //     return status(403, {
//                 //         success: false,
//                 //         error: 'Conta inativa',
//                 //         message: 'Sua conta foi desativada. Entre em contato com o suporte.'
//                 //     })
//                 // }
//             }
//         }
//     })

// /**
//  * Middleware combinado que aplica várias verificações
//  */
// export const strictAuth = new Elysia({ name: 'strict-auth' })
//     .use(requireActiveUser)
//     .use(rateLimitByUser)
//     .use(auditLog)
//     .macro({
//         strictAuth(action: string, resource: string, rateLimitConfig?: { maxRequests?: number, windowMs?: number }) {
//             return {
//                 requireActiveUser: true,
//                 rateLimitByUser: rateLimitConfig?.maxRequests || 10,
//                 auditLog: [action, resource]
//             }
//         }
//     })
