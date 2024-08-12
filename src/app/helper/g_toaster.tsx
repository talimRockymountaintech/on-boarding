import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export class GToaster {
  success({ title, position }: { title: string; position?: string }): any {
    let objsuccess: Record<string, any> = {
      position: position ?? 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored'
}

    return toast.success(title, objsuccess)
  }

  warning({ title, position }: { title: string; position?: string }): any {
    let objWarning: Record<string, any> = {
      position: position ?? 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored'
    }

    return toast.warning(title, objWarning)
  }

  error({ title, position }: { title: string; position?: string }): any {
    let objerror: Record<string, any> = {
      position: position ?? 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored'
    }

    return toast.error(title, objerror)
  }
}
