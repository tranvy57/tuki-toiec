import * as SecureStore from 'expo-secure-store';

export const save = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

export const getValueFor = async (key: string) => {
  let result = await SecureStore.getItemAsync(key);
  // if (result) {
  //   console.log("🔐 Here's your value 🔐 \n" + result);
  // } else {
  //   console.log('No values stored under that key.');
  // }
  return result;
}

export const remove = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};