/** Returns number of ms taken on average for tasks in the category if good. If the response to the query is not a number, undefined. else, throws errors that callers should handle. */
export default async function getAvgForCategory(categoryName: string) {
    try {
        const url = `/api/categories/avg?category=${encodeURIComponent(categoryName)}`
        const res = await fetch(url)

        if (!res.ok) {
            // Try to read body for more detailed error info
            const body = await res.text().catch(() => '')
            throw new Error(`HTTP ${res.status} ${res.statusText} ${body}`)
        }

        const data = await res.json()

        if (Number.isInteger(data.categoryAverageMs)) {
            return data.categoryAverageMs as number;
        }
        else {
            return undefined;
        }
    }
    catch (e: unknown) {
        // Log full error object for debugging
        console.error('Error in getAvgForCategory:', e)

        // Extract a safe message to show to the user
        const message = e instanceof Error ? e.message : String(e)
        alert(`Error occurred: ${message}`)

        // Re-throw so callers can handle the error as well
        throw e
    }
}