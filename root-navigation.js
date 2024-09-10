import {CommonActions, StackActions} from '@react-navigation/native';
import {isReadyRef, navigationRef} from './navigation-helper';

export function navigate(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current.navigate(name, params);
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}

export function replace(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current?.dispatch(StackActions.replace(name, params));
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}

export function reset(name) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current.reset({
      index: 0,
      routes: [{name: name}],
    });
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}

export function goBack() {
  if (isReadyRef?.current && navigationRef?.current) {
    navigationRef?.current?.dispatch(CommonActions?.goBack());
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}

export function goBackward(list_multi, list_single, route) {
  const currentRoute = navigationRef?.current?.getCurrentRoute();
  let isMulti = list_multi?.includes(currentRoute?.name);
  let isSingle = list_single?.includes(currentRoute?.name);
  if (isReadyRef?.current && navigationRef?.current) {
    if (isMulti) {
      goBack();
      goBack();
      route ? navigate(route) : null;
    }
    if (isSingle) {
      goBack();
      route ? navigate(route) : null;
    }
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}

export function getCurrentRoute() {
  const currentRoute = navigationRef?.current?.getCurrentRoute();
  return currentRoute;
}
export function getCurrentRouteParams() {
  const currentRoute = navigationRef?.current?.getCurrentRoute();
  return currentRoute?.params;
}
