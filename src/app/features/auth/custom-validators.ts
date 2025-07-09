import { AbstractControl, ValidationErrors } from '@angular/forms';

// ✅ Custom Validator Functions
export class CustomValidators {
    static mobile(control: AbstractControl): ValidationErrors | null {
        const pattern = /^[6-9]\d{9}$/;
        return control.value && !pattern.test(control.value) ? { invalidMobile: true } : null;
    }

    static pinCode(control: AbstractControl): ValidationErrors | null {
        const pattern = /^\d{6}$/;
        return control.value && !pattern.test(control.value) ? { invalidPinCode: true } : null;
    }

    static website(control: AbstractControl): ValidationErrors | null {
        const pattern = /^(https?:\/\/)?([\w\d-]+\.)+[a-z]{2,}(\/.*)?$/i;
        return control.value && !pattern.test(control.value) ? { invalidWebsite: true } : null;
    }

    static dateFormat(control: AbstractControl): ValidationErrors | null {
        const pattern = /^\d{4}-\d{2}-\d{2}$/;
        return control.value && !pattern.test(control.value) ? { invalidDateFormat: true } : null;
    }
}


