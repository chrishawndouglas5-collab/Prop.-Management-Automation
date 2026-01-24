import { Client } from '@notionhq/client'

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
})

const DATABASE_ID = process.env.NOTION_DATABASE_ID

type LogType = 'NEW_CUSTOMER' | 'REPORT_GENERATED' | 'ERROR' | 'CHURN_RISK'

export async function logToNotion(type: LogType, message: string, metadata: any = {}) {
    if (!process.env.NOTION_API_KEY || !DATABASE_ID) {
        console.warn('Notion logging skipped: Missing API Key or Database ID')
        return { success: false, skipped: true }
    }

    try {
        const response = await notion.pages.create({
            parent: { database_id: DATABASE_ID },
            properties: {
                Type: {
                    select: {
                        name: type,
                    },
                },
                Message: {
                    title: [
                        {
                            text: {
                                content: message,
                            },
                        },
                    ],
                },
                Metadata: {
                    rich_text: [
                        {
                            text: {
                                content: JSON.stringify(metadata, null, 2).slice(0, 2000), // Notion limit
                            },
                        },
                    ],
                },
                Timestamp: {
                    date: {
                        start: new Date().toISOString(),
                    },
                },
            },
        })
        return { success: true, id: response.id }
    } catch (error) {
        console.error('Failed to log to Notion:', error)
        return { success: false, error }
    }
}
