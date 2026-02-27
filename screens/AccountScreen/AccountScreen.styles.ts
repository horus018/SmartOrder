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
    marginBottom: 25,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  leftColumn: {
    flexDirection: "column",
  },

  label: {
    fontSize: 20,
    fontWeight: "500",
    color: "#0B0F14",
    marginBottom: 3,
  },

  labelBold: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0B0F14",
    marginBottom: 3,
  },

  items: {
    fontSize: 14,
    color: "#6D8187",
  },

  value: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0B0F14",
  },

  valueBold: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0B0F14",
  },

  rateButton: {
    backgroundColor: "#C8A23B",
    paddingVertical: 15,
    marginHorizontal: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },

  rateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  dottedLine: {
    flex: 1,
    borderBottomWidth: 3,
    borderStyle: "dotted",
    borderColor: "#0B0F14",
    marginHorizontal: 10,
    marginTop: 12,
  },
});

const rateStyles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0B0F14",
  },
  subtitle: {
    fontSize: 13,
    color: "#6D8187",
    marginBottom: 25,
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: "row",
    marginBottom: 15,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkLabel: {
    marginLeft: 10,
    color: "#0B0F14",
  },
  addComments: {
    fontSize: 15,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#eacb7a",
    borderRadius: 10,
    padding: 10,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: "#EDA85C",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

const thankStyles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    marginTop: 25,
    fontSize: 20,
    fontWeight: "900",
    color: "#0B0F14",
  },
  subtitle: {
    marginTop: 5,
    fontSize: 15,
    color: "#6D8187",
    marginBottom: 40,
  },
  button: {
    borderWidth: 2,
    borderColor: "#eacb7a",
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 10,
  },
  buttonText: {
    color: "#C8A23B",
    fontSize: 18,
    fontWeight: "700",
  },
});

export { styles, rateStyles, thankStyles };