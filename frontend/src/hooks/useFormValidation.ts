import { useState } from 'react';
import { z } from 'zod';

interface ValidationError {
  [key: string]: string;
}

export function useFormValidation<T extends z.ZodType>(schema: T) {
  const [errors, setErrors] = useState<ValidationError>({});

  const validate = (data: any): data is z.infer<T> => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: ValidationError = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const clearErrors = () => setErrors({});
  const setError = (field: string, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  return { errors, validate, clearErrors, setError };
}