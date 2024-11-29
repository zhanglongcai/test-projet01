import toast from 'react-hot-toast';

class ToastManager {
  private activeToasts: string[] = [];
  private readonly maxToasts: number = 3;

  private addToast(id: string) {
    // Remove oldest toast if we're at max capacity
    while (this.activeToasts.length >= this.maxToasts) {
      const oldestId = this.activeToasts.shift();
      if (oldestId) {
        toast.dismiss(oldestId);
      }
    }
    this.activeToasts.push(id);
  }

  private removeToast(id: string) {
    const index = this.activeToasts.indexOf(id);
    if (index > -1) {
      this.activeToasts.splice(index, 1);
    }
  }

  success(message: string) {
    const id = toast.success(message, {
      id: `toast-${Date.now()}`, // Ensure unique ID
      duration: 2000,
      onClose: () => this.removeToast(id),
    });
    this.addToast(id);
    return id;
  }

  error(message: string) {
    const id = toast.error(message, {
      id: `toast-${Date.now()}`, // Ensure unique ID
      duration: 2000,
      onClose: () => this.removeToast(id),
    });
    this.addToast(id);
    return id;
  }

  dismiss(id?: string) {
    if (id) {
      this.removeToast(id);
      toast.dismiss(id);
    } else {
      this.activeToasts = [];
      toast.dismiss();
    }
  }
}

export const toastManager = new ToastManager();