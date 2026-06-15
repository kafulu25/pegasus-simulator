import React from 'react';
import { pdf, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register monospace font
Font.register({
  family: 'Courier',
  src: 'https://fonts.gstatic.com/s/courierprime/v12/u-450q2lgwslOqpF_6gQ8kELaw9pWt_-.ttf',
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#000000',
    padding: 30,
    fontFamily: 'Courier',
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#00ff00',
    paddingBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ff00',
    marginBottom: 8,
  },
  section: {
    marginBottom: 15,
    border: 1,
    borderColor: '#00ff00',
    padding: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00ff00',
    marginBottom: 10,
    borderBottom: 1,
    borderBottomColor: '#00ff00',
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
    fontSize: 9,
  },
  label: {
    width: 120,
    color: '#00ff00',
  },
  value: {
    flex: 1,
    color: '#00ff00',
  },
  callRow: {
    flexDirection: 'row',
    marginBottom: 4,
    fontSize: 8,
    borderBottom: 1,
    borderBottomColor: '#003300',
    paddingBottom: 2,
  },
  colDir: { width: 50 },
  colNum: { width: 80 },
  colDur: { width: 60 },
  colApp: { width: 60 },
  messageBlock: {
    marginBottom: 8,
    backgroundColor: '#001100',
    padding: 6,
  },
  base64Text: {
    fontSize: 6,
    color: '#00cc00',
    marginBottom: 2,
  },
  decodedText: {
    fontSize: 8,
    color: '#00ff00',
    fontWeight: 'bold',
    marginTop: 3,
    paddingTop: 3,
    borderTop: 1,
    borderTopColor: '#00ff00',
    borderTopStyle: 'dashed',
  },
  deletedBadge: {
    backgroundColor: '#330000',
    color: '#ff4444',
    fontSize: 6,
    marginBottom: 3,
    padding: 2,
  },
  errorBox: {
    backgroundColor: '#330000',
    border: 1,
    borderColor: '#ff4444',
    padding: 6,
    marginTop: 5,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 7,
  },
  footer: {
    marginTop: 20,
    borderTop: 1,
    borderTopColor: '#00ff00',
    paddingTop: 8,
    fontSize: 7,
    textAlign: 'center',
    color: '#00ff00',
  },
});

interface CallDetail {
  direction: string;
  number: string;
  duration: number;
  app: string;
}

interface MessageDetail {
  direction: string;
  text: string;
  base64: string;
  timestamp: Date;
  isDeleted: boolean;
  app: string;
}

interface ReportData {
  targetName: string;
  targetPhone: string;
  targetCoordinates: { lat: number; lng: number; ip?: string };
  calls: CallDetail[];
  messages: MessageDetail[];
  microphoneStatus: { success: boolean; error?: string; timestamp?: Date };
  callStats: { total: number; incoming: number; outgoing: number; uniqueNumbers: number; totalDuration: number };
  deletedMessages: number;
  locationCount: number;
}

export const generateEnhancedReport = async (data: ReportData): Promise<Blob> => {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const EnhancedReportPDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PEGASUS INTELLIGENCE REPORT</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Target:</Text>
            <Text style={styles.value}>{data.targetName} ({data.targetPhone})</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Coordinates/IP:</Text>
            <Text style={styles.value}>
              {data.targetCoordinates.ip 
                ? `${data.targetCoordinates.ip} → ${data.targetCoordinates.lat.toFixed(4)}°, ${data.targetCoordinates.lng.toFixed(4)}°`
                : `${data.targetCoordinates.lat.toFixed(4)}°, ${data.targetCoordinates.lng.toFixed(4)}°`}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Generated:</Text>
            <Text style={styles.value}>{new Date().toLocaleString()}</Text>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>STATISTICS OVERVIEW</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Total Calls:</Text>
            <Text style={styles.value}>{data.callStats.total}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Incoming/Outgoing:</Text>
            <Text style={styles.value}>{data.callStats.incoming} / {data.callStats.outgoing}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Messages:</Text>
            <Text style={styles.value}>{data.messages.length}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Deleted Messages:</Text>
            <Text style={styles.value}>{data.deletedMessages}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Locations Tracked:</Text>
            <Text style={styles.value}>{data.locationCount}</Text>
          </View>
        </View>

        {/* Call Logs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CALL LOGS</Text>
          {data.calls.map((call, idx) => (
            <View key={idx} style={styles.callRow}>
              <Text style={styles.colDir}>{call.direction === 'incoming' ? 'IN' : 'OUT'}</Text>
              <Text style={styles.colNum}>{call.number}</Text>
              <Text style={styles.colDur}>{formatDuration(call.duration)}</Text>
              <Text style={styles.colApp}>{call.app}</Text>
            </View>
          ))}
        </View>

        {/* Messages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INTERCEPTED MESSAGES</Text>
          {data.messages.map((msg, idx) => (
            <View key={idx} style={styles.messageBlock}>
              {msg.isDeleted && (
                <View style={styles.deletedBadge}>
                  <Text>[DELETED MESSAGE - RECOVERED]</Text>
                </View>
              )}
              <Text style={{ fontSize: 7, color: '#00ff00' }}>
                [{msg.app}] {msg.direction === 'in' ? '← RECEIVED' : '→ SENT'}
              </Text>
              <Text style={styles.base64Text}>BASE64: {msg.base64}</Text>
              <Text style={styles.decodedText}>DECODED: {msg.text}</Text>
            </View>
          ))}
        </View>

        {/* Microphone Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MICROPHONE STATUS</Text>
          {data.microphoneStatus.success ? (
            <Text style={{ color: '#00ff00' }}>✓ Recording successful</Text>
          ) : (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>✗ MICROPHONE INTERCEPTION FAILED</Text>
              <Text style={styles.errorText}>Error: {data.microphoneStatus.error}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>CLASSIFICATION: TOP SECRET // NOFORN</Text>
          <Text>Generated by Pegasus Intelligence Platform</Text>
        </View>
      </Page>
    </Document>
  );

  const blob = await pdf(<EnhancedReportPDF />).toBlob();
  return blob;
};