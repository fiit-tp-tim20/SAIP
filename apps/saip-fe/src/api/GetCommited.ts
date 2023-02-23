export const getCommited = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/commited`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}
        },
    })

    if (response.ok) {
        const data = await response.json()
        return data
    }
}

