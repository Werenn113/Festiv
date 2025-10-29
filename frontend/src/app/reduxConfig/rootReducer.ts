import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import authReducer from '../../redux/auth/authSlice'
import themeReducer from '../../redux/theme/themeSlice'

const rootPersistConfig = {
	key: 'root',
	storage,
	keyPrefix: 'redux-',
	//   whitelist: [],
	// blacklist: ['doctors'],
}

const rootReducer = combineReducers({
	auth: authReducer,
	theme: themeReducer
})

export { rootPersistConfig, rootReducer }