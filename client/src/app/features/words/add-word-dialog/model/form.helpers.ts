import { FormArray, FormGroup } from '@angular/forms';

export type WithId = { id: string };

// TODO нужно ли???
export type PatchChange<T extends WithId> = {
  created: Omit<T, 'id'>[];
  updated: Partial<T>[];
  deleted: Pick<T, 'id'>[];
};

/**
 * Recursively compares two form value objects (or arrays) and returns `true` if any field has changed.
 *
 * Supports nested objects and arrays. Does shallow comparison for primitives
 * and deep comparison for objects/arrays.
 *
 * @typeParam T - Type of the form value object.
 * @param formValue - The current form value, typically obtained via `form.getRawValue()` or `form.value`.
 * @param initialValue - The original value to compare with.
 * @returns `true` if any field is different, otherwise `false`.
 *
 * @example
 * ```ts
 * const isChanged = checkIsFormChanged(form.getRawValue(), initialValues);
 * ```
 */
export function checkIsFormChanged<T>(formValue: T, initialValue: T): boolean {
  // Arrays
  if (Array.isArray(formValue) && Array.isArray(initialValue)) {
    if (formValue.length !== initialValue.length) return true;

    return formValue.some((val, i) => checkIsFormChanged(val, initialValue[i]));
  }

  // Objects
  if (
    typeof formValue === 'object' &&
    formValue !== null &&
    typeof initialValue === 'object' &&
    initialValue !== null
  ) {
    return (Object.keys(formValue) as Array<keyof T>).some((key: keyof T) => {
      const controlVal = formValue[key];
      const initVal = initialValue[key];

      if (typeof controlVal === 'object' && typeof initVal === 'object') {
        return checkIsFormChanged(controlVal, initVal);
      }
      if (Array.isArray(controlVal) && Array.isArray(initVal)) {
        return checkIsFormChanged(controlVal, initVal);
      }

      return controlVal !== initVal;
    });
  }

  return false;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isPrimitive(value: unknown): value is string | number | boolean | null | undefined | symbol | bigint {
  return value === null || (typeof value !== 'object' && typeof value !== 'function');
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isObject(value: unknown): value is object {
  return value === 'object' && value !== null && !Array.isArray(value) && typeof value !== 'function';
}

// function isPrimitive(value: unknown): boolean {
//   return value === null || (typeof value !== 'object' && typeof value !== 'function');
// }
export function getObjectChanges<T extends WithId>(form: T, initial: T): Partial<T> {
  // console.log('object>>');
  // Objects
  const res: T = {} as T;

  for (const key in form) {
    if (key === 'id') continue;
    if (form[key] !== initial[key]) {
      if (!res.id) res.id = form.id;
      // const typedKey = key as keyof T;
      // console.log('>>>>> object. ', key /*, form[key], '/', initial[key]*/);

      if (Array.isArray(form[key]) && Array.isArray(initial[key])) {
        res[key as keyof T] = getArrayChanges(form[key] as T[], initial[key] as T[]) as unknown as T[typeof key];
      } else {
        res[key] = form[key];
      }
    }
  }

  return res;
}

export function getArrayDiff<T extends WithId>(formArr: T[], initArr: T[]): PatchChange<T> {
  const created: Omit<T, 'id'>[] = [];
  const updated: Partial<T>[] = [];
  const deleted: Pick<T, 'id'>[] = [];

  const initMap = new Map(initArr.map((item) => [item.id, item]));

  for (const item of formArr) {
    if (!item.id) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = item;
      created.push(rest);
    } else {
      const init = initMap.get(item.id);
      if (init) {
        const diff = getObjectChanges(item, init);
        if (Object.keys(diff).length > 1) {
          updated.push(diff);
        }
        initMap.delete(item.id);
      }
    }
  }
  for (const removed of initMap.values()) {
    deleted.push({ id: removed.id });
  }

  return { created, updated, deleted };
}

export function getArrayChanges<T extends WithId>(form: T[], initValue: T[]): Partial<T>[] {
  const arr: T[] = [];

  for (const [index, value] of form.entries()) {
    // console.log('>>>>> array.', index, value);
    const currId = value.id;
    // console.log('id: ' + currId);
    if (!Array.isArray(value) && typeof value === 'object') {
      // console.log('----------', value);
      const currInit = initValue.find((item) => item.id === currId);
      if (currInit) {
        for (const key in value) {
          if (value[key] !== currInit[key]) {
            // console.log(key + ':', value[key], ' or ', currInit[key]);
            if (!arr[index]) {
              arr[index] = { id: currId } as T;
            }
            arr[index][key] = value[key];
          }
        }
      }
    }
  }
  console.log('===arr', arr);
  return arr;
}

export function getChanges<T extends WithId>(form: T | T[], initial: T | T[]): Partial<T> | Partial<T>[] {
  // console.log('<<<<< START >>>>>>>>>>>>>>>>>>>>>>>');
  if (Array.isArray(form) && Array.isArray(initial)) {
    // console.log('<<<<< ARRAY >>>>>');
    return getArrayChanges(form, initial);
  }

  if (typeof form === 'object' && form !== null && typeof initial === 'object' && initial !== null) {
    // console.log('<<<<< OBJECT >>>>>');
    return getObjectChanges(form as T, initial as T);
  }
  // console.log('<<<<< END >>>>>>>>>>>>>>>>>>>>>>>');
  return {};
}

// console.log('---------', '\n\n', 'RESULT:', getChanges(formObj, initObj));

// function buildWordPatchPayload(formObj: Word, initObj: Word): WordPatchPayload {
//   const changes = getChanges(formObj, initObj);
//   const translations = getArrayDiff(formObj, initObj);
//
//   // return { ...changes, translations: patchObj };
//   return { ...changes, translations };
// }
// buildWordPatchPayload(formObj, initObj);

/**
 * Removes all `FormGroup` entries from a `FormArray` where the specified control's value is empty or contains only whitespace.
 *
 * Useful for cleaning up dynamic form arrays (e.g., translations) before submitting or validating.
 *
 * @param sourceFormArray - A `FormArray` consisting of `FormGroup` elements.
 * @param targetName - The name of the control inside each `FormGroup` to be checked for emptiness.
 *
 * @example
 * ```ts
 * // Remove all translation groups where 'text' is empty or only whitespace
 * removeFormGroupsWithEmptyValuesIn(translationsArray, 'text');
 * ```
 */
export function removeFormGroupsWithEmptyValuesIn(sourceFormArray: FormArray<FormGroup>, targetName: string): void {
  const length: number = sourceFormArray.getRawValue().length;
  const arrayForRemove: number[] = [];
  for (let i = 0; i < length; i++) {
    const groupItem = sourceFormArray.controls.at(i) as FormGroup;
    if (groupItem.controls[targetName].value.toString().trim() === '') {
      arrayForRemove.push(i);
    }
  }

  // Remove from end to preserve indexes
  for (let i = length - 1; i >= 0; i--) {
    if (arrayForRemove.includes(i)) {
      sourceFormArray.removeAt(i);
    }
  }
}

// const result: Partial<T> = {};
// const resObj: Partial<T> = {};
// console.log('<< STARTT >>', Array.isArray(form) ? 'array' : 'object');
// // Array
// if (Array.isArray(form) && Array.isArray(initial)) {
//   console.log('array>>');
//   const arr: T[] = [];
//   // for (const [index, value] of form.entries()) {
//   //   console.log('>>>>> array.', index, value);
//   //   const currId = value.id;
//   //   console.log('id: ' + currId);
//   //   if (!Array.isArray(value) && typeof value === 'object') {
//   //     // console.log('----------', value);
//   //     const currInit = initValue.find((item) => item.id === currId);
//   //     if (currInit) {
//   //       for (const key in value) {
//   //         if (value[key] !== currInit[key]) {
//   //           // console.log(key + ':', value[key], ' or ', currInit[key]);
//   //           if (!arr[index]) {
//   //             arr[index] = { id: currId } as T;
//   //           }
//   //           arr[index][key] = value[key];
//   //         }
//   //       }
//   //     }
//   //   }
//   // }
//   console.log('===arr', arr);
//   return arr;
// } else if (
//   typeof formValue === 'object' &&
//   !Array.isArray(formValue) &&
//   !Array.isArray(initValue) &&
//   !isPrimitive(formValue)
// ) {
//   console.log('object>>');
//   // Objects
//   const res: T = {} as T;
//   // const resArr: Partial<T>[] = [];
//   res.id = formValue.id;
//
//   for (const key in formValue) {
//     if (formValue[key] !== initValue[key]) {
//       // const typedKey = key as keyof T;
//       console.log('>>>>> object.', key, formValue[key], '/', initValue[key]);
//
//       if (Array.isArray(formValue[key]) && Array.isArray(initValue[key]) && key in res) {
//         // const ddd = getChanges<T>(formValue[key], initValue[key]);
//         // resArr.push(...getChanges(formValue[key], initValue[key]) as unknown as T[typeof key]);
//         const subChanges = getChanges(formValue[key], initValue[key]) as unknown as T[typeof key];
//         console.log('===subChanges', key, subChanges);
//         res[key as keyof T] = subChanges;
//       } else {
//         res[key] = formValue[key];
//       }
//     }
//   }
//
//   return res;
// }

// console.log('resObj exitMain = ', resObj);

// const formObj = {
//   id: '6865997bbe5fcea8256eddfc',
//   text: 'add changed',
//   language: 'en',
//   translations: [
//     {
//       id: '6865997bbe5fcea8256eddfb',
//       text: 'добавить',
//       language: 'en',
//       description: '',
//       difficultyLevel: '22',
//       lexicalCategory: '',
//     },
//     {
//       id: '',
//       text: 'добавить',
//       language: 'en',
//       description: 'desc changed',
//       difficultyLevel: '',
//       lexicalCategory: '',
//     },
//   ],
// };
// const initObj = {
//   id: '6865997bbe5fcea8256eddfc',
//   owner: '674e46f856839e0561796acc',
//   text: 'add',
//   language: 'en',
//   translations: [
//     {
//       id: '6865997bbe5fcea8256eddfb',
//       text: 'добавить',
//       language: 'en',
//       description: 'desc changeddd',
//       difficultyLevel: '1',
//       lexicalCategory: '',
//     },
//     {
//       id: '6865997bbe5fcea8256eddff',
//       text: 'добавить',
//       language: 'en',
//       description: 'desc changedd',
//       difficultyLevel: '',
//       lexicalCategory: '',
//     },
//   ],
//   isPublic: false,
// };
