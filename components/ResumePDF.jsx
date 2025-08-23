import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "black",
    flexDirection: "column",
  },
  header: { alignItems: "center", marginBottom: 10 },
  name: { fontSize: 20, fontWeight: "bold" },
  jobTitle: { fontSize: 12, marginBottom: 4 },
  contact: { fontSize: 10, color: "gray" },
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  hr: { borderBottomWidth: 1, marginBottom: 6 },
  item: { marginBottom: 6 },
  subTitle: { fontSize: 10, fontWeight: "bold" },
  subText: { fontSize: 9, color: "#333" },
  skillBar: {
    height: 4,
    backgroundColor: "#ddd",
    marginTop: 2,
  },
  skillFill: {
    height: 4,
  },
});

export default function ResumePDF({ resumeInfo }) {
  const color = resumeInfo?.themeColor || "#000";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Personal Details */}
        <View style={styles.header}>
          <Text style={[styles.name, { color }]}>{resumeInfo.fullName}</Text>
          <Text style={styles.jobTitle}>{resumeInfo.jobTitle}</Text>
          <Text style={[styles.contact, { color }]}>{resumeInfo.address}</Text>
          <Text style={[styles.contact, { color }]}>
            {resumeInfo.phone} | {resumeInfo.email}
          </Text>
        </View>

        {/* Summary */}
        {resumeInfo.summary && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color }]}>Summary</Text>
            <View style={[styles.hr, { borderBottomColor: color }]} />
            <Text>{resumeInfo.summary}</Text>
          </View>
        )}

        {/* Education */}
        {resumeInfo.education?.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color }]}>Education</Text>
            <View style={[styles.hr, { borderBottomColor: color }]} />
            {resumeInfo.education.map((edu, idx) => (
              <View key={idx} style={styles.item}>
                <Text style={[styles.subTitle, { color }]}>{edu.universityName}</Text>
                <Text style={styles.subText}>
                  {edu.degree} in {edu.major} ({edu.startDate} - {edu.endDate})
                </Text>
                {edu.description && <Text>{edu.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Experience */}
        {resumeInfo.experience?.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color }]}>Professional Experience</Text>
            <View style={[styles.hr, { borderBottomColor: color }]} />
            {resumeInfo.experience.map((exp, idx) => (
              <View key={idx} style={styles.item}>
                <Text style={[styles.subTitle, { color }]}>{exp.title}</Text>
                <Text style={styles.subText}>
                  {exp.companyName}, {exp.city}, {exp.state} •{" "}
                  {exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate}
                </Text>
                {exp.worksummary && (
                  <Text>{exp.worksummary.replace(/<[^>]*>?/gm, "")}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {resumeInfo.projects?.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color }]}>Projects</Text>
            <View style={[styles.hr, { borderBottomColor: color }]} />
            {resumeInfo.projects.map((proj, idx) => (
              <View key={idx} style={styles.item}>
                <Text style={[styles.subTitle, { color }]}>{proj.title}</Text>
                <Text>{proj.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {resumeInfo.skills?.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color }]}>Skills</Text>
            <View style={[styles.hr, { borderBottomColor: color }]} />
            {resumeInfo.skills.map((skill, idx) => (
              <View key={idx} style={{ marginBottom: 4 }}>
                <Text>{skill.name}</Text>
                <View style={styles.skillBar}>
                  <View
                    style={[
                      styles.skillFill,
                      { width: `${skill.rating * 20}%`, backgroundColor: color },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
