import toast from "react-hot-toast"
import api from "../axiosConfig/axiosConfig"

export const register = async (
	setIsLoading: (arg: boolean) => void,
	data: {
		username: string,
		email: string,
		password: string
	}) => {
	try {
		setIsLoading(true)
		const response = await api.post('auth/register', { ...data })
		return response.data
	} catch (error: any) {
		if (error.response) {
			toast.error(`Erreur lors de la création d'un utilisateur : ${error.response.data.message}`)
		} else if (error.request) {
			toast.error(`Erreur lors de la création d'un utilisateur : ${error.request}`)
		} else {
			toast.error(`Erreur lors de la création d'un utilisateur : ${error.message}`)
		}
	}
}


export const login = async (
	setIsLoading: (arg: boolean) => void,
	data: {
		email: string,
		password: string
	}) => {
	try {
		setIsLoading(true)
		const response = await api.post('auth/login', { ...data })
		return response
	} catch (error: any) {
		if (error.response) {
			if (error.response) {
				toast.error(`Erreur lors de la connexion d'un utilisateur : ${error.response.data.message}`)
			} else if (error.request) {
				toast.error(`Erreur lors de la connexion d'un utilisateur : ${error.request}`)
			} else {
				toast.error(`Erreur lors de la connexion d'un utilisateur : ${error.message}`)
			}
		}
	} finally {
		setIsLoading(false)
	}
}


export const checkAuth = async (
	setIsLoading?: (arg: boolean) => void,
) => {
	try {
		if (setIsLoading) setIsLoading(true)
		const response = await api.get(`auth/status`)
		return response.data.content
	} catch (error: any) {
		if (error.response) {
			if (error.response) {
				toast.error(`Erreur lors de la vérification d'authentification d'un utilisateur : ${error.response.data.message}`)
			} else if (error.request) {
				toast.error(`Erreur lors de la vérification d'authentification d'un utilisateur : ${error.request}`)
			} else {
				toast.error(`Erreur lors de la vérification d'authentification d'un utilisateur : ${error.message}`)
			}
		}
	} finally {
		if (setIsLoading) setIsLoading(false)
	}
}


export const logout = async (
	setIsLoading: (arg: boolean) => void) => {
	try {
		setIsLoading(true)
		const response = await api.post(`auth/logout`)
		return response
	} catch (error: any) {
		if (error.response) {
			if (error.response) {
				toast.error(`Erreur lors de la déconnexion d'un utilisateur : ${error.response.message}`)
			} else if (error.request) {
				toast.error(`Erreur lors de la déconnexion d'un utilisateur : ${error.request}`)
			} else {
				toast.error(`Erreur lors de la déconnexion d'un utilisateur : ${error.message}`)
			}
		}
	} finally {
		setIsLoading(false)
	}
}


export const deleteUser = async (
	setIsLoading: (arg: boolean) => void) => {
	try {
		setIsLoading(true)
		const response = await api.post(`auth/delete-user`)
		return response
	} catch (error: any) {
		if (error.response) {
			if (error.response) {
				toast.error(`Erreur lors de la suppression d'un utilisateur : ${error.response.message}`)
			} else if (error.request) {
				toast.error(`Erreur lors de la suppression d'un utilisateur : ${error.request}`)
			} else {
				toast.error(`Erreur lors de la suppression d'un utilisateur : ${error.message}`)
			}
		}
	} finally {
		setIsLoading(false)
	}
}