import React, {memo} from 'react';
import MyTabs from '../../../navigations/bottom-tab';
interface IProps {}
const HomeScreen = memo(({}: IProps) => {
  return <MyTabs />;
});
export default HomeScreen;
