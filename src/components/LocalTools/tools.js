import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { faFilePdf, faFileWord, faFileExcel, faFilePowerpoint, faFileAlt, faFileCode } from '@fortawesome/free-solid-svg-icons';


export const formatTimeAgo = (date) => {
    const diff = moment.preciseDiff(date, moment(), true);
    let timeAgo = '';
  
    if (diff.years > 0) {
      timeAgo = `hace ${diff.years} ${diff.years === 1 ? 'año' : 'años'}`;
    } else if (diff.months > 0) {
      timeAgo = `hace ${diff.months} ${diff.months === 1 ? 'mes' : 'meses'}`;
    } else if (diff.days > 0) {
      timeAgo = `hace ${diff.days} ${diff.days === 1 ? 'día' : 'días'}`;
    } else if (diff.hours > 0) {
      timeAgo = `hace ${diff.hours} ${diff.hours === 1 ? 'hora' : 'horas'}`;
    } else if (diff.minutes > 0) {
      timeAgo = `hace ${diff.minutes} ${diff.minutes === 1 ? 'minuto' : 'minutos'}`;
    } else {
      timeAgo = `hace unos segundos`;
    }
  
    return timeAgo;
  };


export const CopyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Texto copiado al portapapeles');
      })
      .catch(err => {
        toast.error('Error al copiar al portapapeles');
      });
  };


  // Función para formatear el tamaño del archivo
export const formatSize = (size) => {
    const fileSizeInBytes = parseInt(size);
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
    return fileSizeInMB.toFixed(2) + ' MB';
  };
  
 export const formatCurrency = (value) => {
    const formattedValue = parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return `$${formattedValue} USD`;
  };

  export const mimeIcons = {
    "text/plain": faFileAlt,
    "application/pdf": faFilePdf,
    "application/xml": faFileCode,
    "text/html": faFileCode,
    "application/msword": faFileWord,
    "application/vnd.ms-excel": faFileExcel,
    "application/vnd.ms-powerpoint": faFilePowerpoint,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": faFileWord,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": faFileExcel,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": faFilePowerpoint
  };
  
  export const fileTypes = {
    "text/plain": "Texto",
    "application/pdf": "PDF",
    "application/xml": "XML",
    "text/html": "HTML",
    "application/msword": "Word",
    "application/vnd.ms-excel": "Excel",
    "application/vnd.ms-powerpoint": "PowerPoint",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PowerPoint"
  };
  
  export const colorFile = {
    "Word": 'primary',
    "Texto": 'secondary',
    "Excel": 'success',
    "PDF": 'danger',
    "HTML": 'cyan',
    "XML": 'indigo',
    "PowerPoint": 'pink'
  };
  
  
  