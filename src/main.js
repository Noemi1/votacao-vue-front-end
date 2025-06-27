import { createApp } from 'vue'
import App from './App.vue'

// CSS
import './App.css'

// PrimeVue
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura';

import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

// PrimeVue Components
import Avatar from 'primevue/avatar';
import AvatarGroup from 'primevue/avatargroup';   //Optional for grouping
import Button from 'primevue/button'
import Card from 'primevue/card'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import Fluid from 'primevue/fluid';
import Image from 'primevue/image'
import InputText from 'primevue/inputtext'
import Menubar from 'primevue/menubar';
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Toolbar from 'primevue/toolbar';

import { definePreset } from '@primeuix/themes';
import PrimeUI from 'tailwindcss-primeui';


import axios from 'axios'

const app = createApp(App)

// Configurar axios
axios.defaults.baseURL = 'http://localhost:3000'
const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#fdf2f8',   // Rosa muito claro - fundo
            100: '#fce7f3',  // Rosa claro - hover suave
            200: '#fbcfe8',  // Rosa médio-claro - bordas
            300: '#f9a8d4',  // Rosa médio - elementos secundários
            400: '#f472b6',  // Rosa vibrante - destaque
            500: '#e91e63',  // Rosa principal - botões principais
            600: '#c2185b',  // Rosa escuro - hover
            700: '#ad1457',  // Rosa mais escuro - texto
            800: '#880e4f',  // Rosa muito escuro - elementos importantes
            900: '#4a148c',  // Rosa profundo - destaque máximo
            950: '#2d0b3a'   // Rosa quase roxo - elementos especiais
        }
    }
});
// PrimeVue com tema personalizado rosa/vermelho
app.use(PrimeVue, { 
  ripple: true, 
  theme: { 
    preset: MyPreset,
    options: {
      darkModeSelector: '.dark',
      cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities',
      primeui: PrimeUI
    },
  }
})
app.use(ToastService)

// Registrar componentes
app.component('Avatar', Avatar)
app.component('AvatarGroup', AvatarGroup)
app.component('Button', Button)
app.component('Card', Card)
app.component('Column', Column)
app.component('DataTable', DataTable)
app.component('Dialog', Dialog)
app.component('Divider', Divider)
app.component('Fluid', Fluid)
app.component('Image', Image)
app.component('InputText', InputText)
app.component('Menubar', Menubar)
app.component('ProgressBar', ProgressBar)
app.component('Tag', Tag)
app.component('Textarea', Textarea)
app.component('Toast', Toast)
app.component('Toolbar', Toolbar)

app.mount('#app')
