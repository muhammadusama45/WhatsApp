import React, {useRef, useState} from 'react';
import {View, Button, Text, StyleSheet} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {launchImageLibrary} from 'react-native-image-picker';

const CustomCameraScreen = () => {
  const cameraRef = useRef(null);
  const [isCameraVisible, setIsCameraVisible] = useState(true);
  const [photoUri, setPhotoUri] = useState(null);

  const openLibrary = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets) {
        // Handle library response
      }
    });
  };

  const capturePhoto = async () => {
    if (cameraRef.current) {
      try {
        const options = {quality: 0.5, base64: true};
        const data = await cameraRef.current.takePictureAsync(options);
        setPhotoUri(data.uri); // Save the photo URI
        setIsCameraVisible(false); // Hide camera after capture
      } catch (error) {
        console.error('Error capturing photo:', error);
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      {isCameraVisible ? (
        <RNCamera
          ref={cameraRef}
          style={{flex: 1}}
          type={RNCamera.Constants.Type.back}
          captureAudio={false}>
          <View style={styles.buttonContainer}>
            <Button title="Capture" onPress={capturePhoto} />
            <Button title="Library" onPress={openLibrary} />
          </View>
        </RNCamera>
      ) : (
        <View style={styles.previewContainer}>
          <Text>Photo Captured!</Text>
          {photoUri && <Text>Photo URI: {photoUri}</Text>}
          <Button
            title="Retake Photo"
            onPress={() => setIsCameraVisible(true)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 100,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomCameraScreen;
