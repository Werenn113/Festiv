import toast from "react-hot-toast";
import { CreatePatientPayload, DeletePatientBloodTestsType, DeletePatientPathoType, DeletePatientTreatmentsType, UpdatePatientBloodTestsType, UpdatePatientPathoType, UpdatePatientPayload, UpdatePatientTreatmentType } from "../../types/types";
import api from "../axiosConfig/axiosConfig";


export const fetchAllPatients = async (
	setErrMsg: (arg: string) => void,
) => {
	try {
		const response = await api.get(`patients/find-all`)
		return response.data.content
	} catch (error: any) {
		if (error.response) {
			if (error.response) {
				console.error('Error response data:', error.response.data);
				console.error('Error status:', error.response.status);
				console.error('Error headers:', error.response.headers);
				setErrMsg(`Erreur lors de la récupération de tous les patients : ${error.response.data.error}`)
			} else if (error.request) {
				console.error('Error request:', error.request.message);
				setErrMsg(`Erreur lors de la récupération de tous les patients : ${error.request}`)
			} else {
				console.error('Error message:', error.message);
				setErrMsg(`Erreur lors de la récupération de tous les patients : ${error.message}`)
			}
		}
	}
}

export const createPatient = async (
	setErrMsg: (arg: string) => void,
	patient: CreatePatientPayload) => {
	try {
		const response = await api.post(`patients/create-patient`, {
			...patient
		})
		return response.data.content
	} catch (error: any) {
		if (error.response) {
			if (error.response) {
				console.error('Error response data:', error.response.data);
				console.error('Error status:', error.response.status);
				console.error('Error headers:', error.response.headers);
				setErrMsg(`Erreur lors de la création d'un nouveau patient : ${error.response.data.error}`)
			} else if (error.request) {
				console.error('Error request:', error.request.message);
				setErrMsg(`Erreur lors de la création d'un nouveau patient : ${error.request}`)
			} else {
				console.error('Error message:', error.message);
				setErrMsg(`Erreur lors de la création d'un nouveau patient : ${error.message}`)
			}
		}
	}
}

export const updatePatient = async (
	setIsLoading: (arg: boolean) => void,
	data: UpdatePatientPayload) => {
	try {
		setIsLoading(true)
		const response = await api.post(`patients/update-patient`, {
			...data
		})
		return response.data.content
	} catch (error: any) {
		if (error.response) {
			if (error.response) {
				toast.error(`Erreur lors de la mise à jour d'un patient : ${error.response.data.error}`)
			} else if (error.request) {
				toast.error(`Erreur lors de la mise à jour d'un patient : ${error.request}`)
			} else {
				toast.error(`Erreur lors de la mise à jour d'un patient : ${error.message}`)
			}
		}
	} finally {
		setIsLoading(false)
	}
}

export const updatePatientPathoglogies = async (
	setIsLoading: (arg: boolean) => void,
	data: UpdatePatientPathoType) => {
	try {
		setIsLoading(true)
		const response = await api.post(`patients/update-patient-pathologies`, {
			...data
		})
		return response.data.content
	} catch (error: any) {
		if (error.response) {
			if (error.response) {
				console.error('Error response data:', error.response.data);
				console.error('Error status:', error.response.status);
				console.error('Error headers:', error.response.headers);
				toast.error(`Erreur lors de la mise à jour des pathologies d'un patient : ${error.response.data.error}`)
			} else if (error.request) {
				console.error('Error request:', error.request.message);
				toast.error(`Erreur lors de la mise à jour des pathologies d'un patient : ${error.request}`)
			} else {
				console.error('Error message:', error.message);
				toast.error(`Erreur lors de la mise à jour des pathologies d'un patient : ${error.message}`)
			}
		}
	} finally {
		setIsLoading(false)
	}
}

export const deletePatientPathoglogies = async (
	setIsLoading: (arg: boolean) => void,
	data: DeletePatientPathoType) => {
	try {
		setIsLoading(true)
		const response = await api.post(`patients/delete-patient-pathologies`, {
			...data
		})
		return response.data.content
	} catch (error: any) {
		if (error.response) {
			if (error.response) {
				console.error('Error response data:', error.response.data);
				console.error('Error status:', error.response.status);
				console.error('Error headers:', error.response.headers);
				toast.error(`Erreur lors de la suppression des pathologies d'un patient : ${error.response.data.error}`)
			} else if (error.request) {
				console.error('Error request:', error.request.message);
				toast.error(`Erreur lors de la suppression des pathologies d'un patient : ${error.request}`)
			} else {
				console.error('Error message:', error.message);
				toast.error(`Erreur lors de la suppression des pathologies d'un patient : ${error.message}`)
			}
		}
	} finally {
		setIsLoading(false)
	}
}

export const updatePatientTreatments = async (
	setIsLoading: (arg: boolean) => void,
	data: UpdatePatientTreatmentType) => {
	try {
		setIsLoading(true)
		const response = await api.post(`patients/update-patient-treatments`, {
			...data
		})
		return response.data.content
	} catch (error: any) {
		if (error.response) {
			if (error.response) {
				console.error('Error response data:', error.response.data);
				console.error('Error status:', error.response.status);
				console.error('Error headers:', error.response.headers);
				toast.error(`Erreur lors de la mise à jour des traitements d'un patient : ${error.response.data.error}`)
			} else if (error.request) {
				console.error('Error request:', error.request.message);
				toast.error(`Erreur lors de la mise à jour des traitements d'un patient : ${error.request}`)
			} else {
				console.error('Error message:', error.message);
				toast.error(`Erreur lors de la mise à jour des traitements d'un patient : ${error.message}`)
			}
		}
	} finally {
		setIsLoading(false)
	}
}

export const deletePatientTreatments = async (
	setIsLoading: (arg: boolean) => void,
	data: DeletePatientTreatmentsType) => {
	try {
		setIsLoading(true)
		const response = await api.post(`patients/delete-patient-treatments`, {
			...data
		})
		return response.data.content
	} catch (error: any) {
		if (error.response) {
			if (error.response) {
				console.error('Error response data:', error.response.data);
				console.error('Error status:', error.response.status);
				console.error('Error headers:', error.response.headers);
				toast.error(`Erreur lors de la suppression des pathologies d'un patient : ${error.response.data.error}`)
			} else if (error.request) {
				console.error('Error request:', error.request.message);
				toast.error(`Erreur lors de la suppression des pathologies d'un patient : ${error.request}`)
			} else {
				console.error('Error message:', error.message);
				toast.error(`Erreur lors de la suppression des pathologies d'un patient : ${error.request}`)
			}
		}
	} finally {
		setIsLoading(false)
	}
}

export const updatePatientBloodTests = async (
	setIsLoading: (arg: boolean) => void,
	data: UpdatePatientBloodTestsType) => {
	try {
		setIsLoading(true)
		const response = await api.post(`patients/update-patient-blood-tests`, {
			...data
		})
		return response.data.content
	} catch (error: any) {
		if (error.response) {
			if (error.response) {
				console.error('Error response data:', error.response.data);
				console.error('Error status:', error.response.status);
				console.error('Error headers:', error.response.headers);
				toast.error(`Erreur lors de la mise à jour des traitements d'un patient : ${error.response.data.error}`)
			} else if (error.request) {
				console.error('Error request:', error.request.message);
				toast.error(`Erreur lors de la mise à jour des traitements d'un patient : ${error.request}`)
			} else {
				console.error('Error message:', error.message);
				toast.error(`Erreur lors de la mise à jour des traitements d'un patient : ${error.message}`)
			}
		}
	} finally {
		setIsLoading(false)
	}
}

export const deletePatientBloodTests = async (
	setIsLoading: (arg: boolean) => void,
	data: DeletePatientBloodTestsType) => {
	try {
		setIsLoading(true)
		const response = await api.post(`patients/delete-patient-blood-test`, {
			...data
		})
		return response.data.content
	} catch (error: any) {
		if (error.response) {
			if (error.response) {
				console.error('Error response data:', error.response.data);
				console.error('Error status:', error.response.status);
				console.error('Error headers:', error.response.headers);
				toast.error(`Erreur lors de la suppression des pathologies d'un patient : ${error.response.data.error}`)
			} else if (error.request) {
				console.error('Error request:', error.request.message);
				toast.error(`Erreur lors de la suppression des pathologies d'un patient : ${error.request}`)
			} else {
				console.error('Error message:', error.message);
				toast.error(`Erreur lors de la suppression des pathologies d'un patient : ${error.request}`)
			}
		}
	} finally {
		setIsLoading(false)
	}
}

export const fetchManyPatientsByName = async (name: string) => {
	try {
		const response = await api.post('patients/find-many-by-name', { name })
		return response.data.content
	} catch (error: any) {
		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			console.error('Error response data:', error.response.data);
			console.error('Error status:', error.response.status);
			console.error('Error headers:', error.response.headers);
		} else if (error.request) {
			// The request was made but no response was received
			console.error('Error request:', error.request);
		} else {
			// Something happened in setting up the request that triggered an Error
			console.error('Error message:', error.message);
		}
		throw error; // Re-throw the error after logging it
	}
}

export const fetchOnePatientById = async (
	setErrMsg: (arg: string) => void,
	id: number
) => {
	try {
		const response = await api.get(`patients/find-one-patient-by-id/${id}`)
		return response.data.content
	} catch (error: any) {
		if (error.response) {
			if (error.response) {
				console.error('Error response data:', error.response.data);
				console.error('Error status:', error.response.status);
				console.error('Error headers:', error.response.headers);
				setErrMsg(`Erreur lors de la récupération de tous les patients : ${error.response.data.error}`)
			} else if (error.request) {
				console.error('Error request:', error.request.message);
				setErrMsg(`Erreur lors de la récupération de tous les patients : ${error.request}`)
			} else {
				console.error('Error message:', error.message);
				setErrMsg(`Erreur lors de la récupération de tous les patients : ${error.message}`)
			}
		}
	}
}

export const assignDoctorsToPatient = async (
	setErrMsg: (arg: string) => void,
	patientId: number,
	doctorIds: string[]
) => {
	try {
		const response = await api.post(`patients/assign-doctors-to-patient`, {
			patientId,
			doctorIds
		})
		return response.data.content
	} catch (error: any) {
		if (error.response) {
			if (error.response) {
				console.error('Error response data:', error.response.data);
				console.error('Error status:', error.response.status);
				console.error('Error headers:', error.response.headers);
				setErrMsg(`Erreur lors de l'assignation de docteurs à un patient : ${error.response.data.error}`)
			} else if (error.request) {
				console.error('Error request:', error.request.message);
				setErrMsg(`Erreur lors de l'assignation de docteurs à un patient : ${error.request}`)
			} else {
				console.error('Error message:', error.message);
				setErrMsg(`Erreur lors de l'assignation de docteurs à un patient : ${error.message}`)
			}
		}
	}
}