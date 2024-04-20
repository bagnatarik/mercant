import axios from "axios";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class API {
    category = 'categories/'
    product = 'products/'
    /* token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1NjU0MDY5MDk3LCJleHBpcmVzIjoxNzEzNjQ2NjQ5LjQzNjIyNH0.D5Os-V7Ylmcm0WBLLv7ZhyjdXyVpjhlornJnJB4aQCM'
    static userId = '5654069097' */
    token = localStorage.getItem('token')
    static userId = localStorage.getItem('user_id')

    async getAllCategories(): Promise<any> {
        const response = await axios.get<any[]>(`${import.meta.env.VITE_API_URL}${this.category}all`);
        return response.data ? response.data : undefined
    }

    async getAllProductByCategoryId(categoryId: string): Promise<any[] | undefined> {
        const response = await axios.get<any[]>(`${import.meta.env.VITE_API_URL}bot/categories/${categoryId}/products`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        return response.data ? response.data : undefined
    }

    async search(term: string): Promise<any[]> {
        const response = await axios.post<any[]>(`${import.meta.env.VITE_API_URL}${this.product}search?search_term=${term}`);
        return response.data
    }

    async createProduct(form: FormData) {
        const response = await axios.post('https://afroked.onrender.com/api/bot/products/web/create', form, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${this.token}`
            }
        });

        return response
    }

    async updateProduct(form: FormData) {
        const response = await axios.put('https://afroked.onrender.com/api/bot/products/web/edit', form, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${this.token}`,
                'accept': 'application/json'
            }
        });

        return response
    }

    async delete(id: string) {
        await axios.delete(`https://afroked.onrender.com/api/bot/products/${id}`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })
    }
}