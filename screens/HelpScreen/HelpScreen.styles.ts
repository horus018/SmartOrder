import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  table: {
    marginTop: 4,
    color: "#ddd",
    paddingLeft: 3,
  },
  tag: {
    backgroundColor: "#E9C46A",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagText: {
    fontWeight: "600",
    color: "#333",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
  },
  subtitle: {
    marginBottom: 10,
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E9C46A",
    marginTop: 10,
    marginBottom: 15,
    marginHorizontal: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#333",
  },
  label: {
    fontSize: 13,
    color: "#666",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E9C46A",
    padding: 10,
    borderRadius: 10,
    fontSize: 14,
  },

  button: {
    backgroundColor: "#F4A261",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
    marginHorizontal: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },

  statusBox: {
    borderWidth: 1,
    borderColor: "#E9C46A",
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 15,
  },
  statusLine: {
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  statusMessage: {
    color: "#1E6F5C",
    fontStyle: "italic",
  },

  bottomMenu: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 70,
    backgroundColor: "#EDEDED",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  centerCircle: {
    width: 55,
    height: 55,
    backgroundColor: "#E9C46A",
    borderRadius: 27.5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -25,
    elevation: 3,
  },
});

export default styles;