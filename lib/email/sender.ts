import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendReportEmail(
    to: string,
    subject: string,
    htmlContent: string,
    attachmentBuffer?: Buffer,
    attachmentName?: string
) {
    try {
        const payload: any = {
            from: 'Property Reports <onboarding@resend.dev>', // Default Resend test domain
            to: [to],
            subject: subject,
            html: htmlContent,
        }

        if (attachmentBuffer && attachmentName) {
            payload.attachments = [
                {
                    filename: attachmentName,
                    content: attachmentBuffer,
                },
            ]
        }

        const data = await resend.emails.send(payload)
        return { success: true, data }
    } catch (error) {
        console.error('Email sending failed:', error)
        return { success: false, error }
    }
}
