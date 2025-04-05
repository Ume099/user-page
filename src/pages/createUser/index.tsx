export const Page = (): JSX.Element => {
  const createTeachingReport = async () => {
    try {
      const data = {
        uid: '',
        email: '',
        password: '',
        displayName: '',
      };
      // エンドポイントに POST リクエストを送信
      // const response = await axios.post('/api/userActions/createUser', data);

      // if (response.status === 201) {
      //   return { success: true, message: response.data.message };
      // } else {
      //   return { success: false, message: response.data.message };
      // }
    } catch (error: any) {
      console.error('Error while creating document:', error);
      return { success: false, message: 'An error occurred while creating the document.' };
    }
  };

  return <div>{/* <button onClick={() => createTeachingReport()}>ssssss</button> */}</div>;
};

export default Page;
