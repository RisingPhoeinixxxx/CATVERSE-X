const API = "http://127.0.0.1:8000";

export async function submitReport(data: any) {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API}/report/`, {

        method: "POST",

        headers: {

            "Content-Type": "application/json",

            Authorization: token
                ? `Bearer ${token}`
                : "",

        },

        body: JSON.stringify(data),

    });

    if (!response.ok) {

        throw new Error("Report submission failed");

    }

    return await response.json();
}