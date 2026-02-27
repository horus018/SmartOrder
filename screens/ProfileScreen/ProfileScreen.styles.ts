import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0B0F14",
    marginTop: 10,
    marginLeft: 15,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#264653",
    marginTop: -5,
    marginLeft: 15,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    marginTop: 15,
  },

  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#C29B2F",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  infoColumn: {
    flex: 1,
    justifyContent: "center",
  },

  username: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0B0F14",
    marginBottom: 5,
  },

  description: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6D8187",
    lineHeight: 18,
  },

  editIcon: {
    padding: 6,
  },

  editRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 15,
  },

  avatarCircleLarge: {
    width: 95,
    height: 95,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#C29B2F",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },

  inputColumn: {
    flex: 1,
  },

  label: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0B0F14",
    marginBottom: 6,
  },

  input: {
    borderWidth: 2,
    borderColor: "#E6B17E",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#0B0F14",
  },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 15,
  },

  changePhotoButton: {
    backgroundColor: "#2A9D8F",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginRight: 15,
    alignItems: "center",
  },

  changePhotoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  saveButton: {
    backgroundColor: "#F4A261",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default styles;