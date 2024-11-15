// ReportTemplate.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Define your styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
  },
  header: {
    border: '1px solid black',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  leftSection: {
    width: '20%',
    textAlign: 'center',
    padding: 5,
    borderRight: '1px solid black',
  },
  logoSection: {
    width: '30%',
    textAlign: 'center',
    padding: 5,
    borderRight: '1px solid black',
    justifyContent: 'center',
  },
  titleSection: {
    width: '25%',
    textAlign: 'center',
    padding: 5,
    borderRight: '1px solid black',
    justifyContent: 'center',
  },
  rightSection: {
    width: '25%',
    textAlign: 'center',
    padding: 5,
  },
  logo: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
  },
  cellBold: {
    fontWeight: 'bold',
  },
  detailsRow: {
    flexDirection: 'row',
    borderTop: '1px solid black',
    paddingTop: 5,
  },
  detailsCell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderColor: '#000',
    flex: 1,
    fontSize: 9,
  },
  tableCellBold: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  footerSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
  },
});

const ReportTemplate = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.header}>
        {/* Left Section: Nomor and Kontraktor */}
        <View style={styles.leftSection}>
          <Text style={styles.cellBold}>Nomor</Text>
          <Text>116</Text>
          <Text style={[styles.cellBold, { marginTop: 10 }]}>Kontraktor:</Text>
          <Text>PT. Graha Sarana Duta</Text>
        </View>

        {/* Center Logo Section */}
        <View style={styles.logoSection}>
          {/* Placeholder for logos */}
          <Text>[Logo Placeholder]</Text>
          <Text>[Logo Placeholder]</Text>
          <Text>[Logo Placeholder]</Text>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.cellBold, { fontSize: 12 }]}>LAPORAN HARIAN</Text>
        </View>

        {/* Right Section: Project Name */}
        <View style={styles.rightSection}>
          <Text style={styles.cellBold}>Telkom DTV ADMEDIKA,</Text>
          <Text style={styles.cellBold}>IPTV (ex. Pins), KAP & AVATAR</Text>
        </View>
      </View>

      {/* Second Row for Date and Attachment */}
      <View style={styles.detailsRow}>
        <View style={[styles.detailsCell, { borderRight: '1px solid black' }]}>
          <Text>Tanggal: 02/09/2024</Text>
        </View>
        <View style={styles.detailsCell}>
          <Text>Lampiran: Dokumentasi</Text>
        </View>
      </View>

      {/* Table Section: Tenaga Kerja */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableCellBold]}>Tenaga Kerja</Text>
          <Text style={[styles.tableCell, styles.tableCellBold]}>Jumlah</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>1. Project Manager</Text>
          <Text style={styles.tableCell}>1 org</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>2. Site Manager</Text>
          <Text style={styles.tableCell}>1 org</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>3. Site Engineer</Text>
          <Text style={styles.tableCell}>1 org</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>4. Admin Project</Text>
          <Text style={styles.tableCell}>1 org</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>5. Drafter</Text>
          <Text style={styles.tableCell}>1 org</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableCellBold]}>Sub Jumlah I</Text>
          <Text style={styles.tableCell}>2 org</Text>
        </View>
      </View>

      {/* Table Section: Lapangan */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableCellBold]}>Lapangan</Text>
          <Text style={[styles.tableCell, styles.tableCellBold]}>Jumlah</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>1. Pekerja Sipil</Text>
          <Text style={styles.tableCell}>10 org</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>2. Pekerja Arsitektur</Text>
          <Text style={styles.tableCell}>8 org</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>3. Pekerja Mekanikal Elektrikal</Text>
          <Text style={styles.tableCell}>4 org</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>4. Pekerja Furniture</Text>
          <Text style={styles.tableCell}>3 org</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableCellBold]}>Sub Jumlah II</Text>
          <Text style={styles.tableCell}>25 org</Text>
        </View>
      </View>

      {/* Table Section: Cuaca */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableCellBold]}>Cuaca</Text>
          <Text style={[styles.tableCell, styles.tableCellBold]}>Cerah</Text>
          <Text style={[styles.tableCell, styles.tableCellBold]}>Gerimis (Waktu)</Text>
          <Text style={[styles.tableCell, styles.tableCellBold]}>Hujan (Waktu)</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Pagi</Text>
          <Text style={styles.tableCell}>✓</Text>
          <Text style={styles.tableCell}>s/d</Text>
          <Text style={styles.tableCell}>s/d</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Siang</Text>
          <Text style={styles.tableCell}>✓</Text>
          <Text style={styles.tableCell}>s/d</Text>
          <Text style={styles.tableCell}>s/d</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Sore</Text>
          <Text style={styles.tableCell}>✓</Text>
          <Text style={styles.tableCell}>s/d</Text>
          <Text style={styles.tableCell}>s/d</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Malam</Text>
          <Text style={styles.tableCell}>✓</Text>
          <Text style={styles.tableCell}>s/d</Text>
          <Text style={styles.tableCell}>s/d</Text>
        </View>
      </View>

      {/* Bottom Table Section */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.tableCellBold]}>Jumlah Tenaga Kerja</Text>
          <Text style={styles.tableCell}>27 org</Text>
        </View>
      </View>

      {/* Footer Section with Signatures */}
      <View style={styles.footerSection}>
        <View style={styles.footerCell}>
          <Text>Dilaporkan Oleh,</Text>
          <Text>Kontraktor Pelaksana</Text>
          <Text>PT Graha Sarana Duta</Text>
        </View>

        <View style={styles.footerCell}>
          <Text>Konsultan Pengawas</Text>
          <Text>PT Multi Reka Indonesia</Text>
        </View>

        <View style={styles.footerCell}>
          <Text style={styles.cellBold}>Adam Rivansyah</Text>
          <Text>Site Manager</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default ReportTemplate;
