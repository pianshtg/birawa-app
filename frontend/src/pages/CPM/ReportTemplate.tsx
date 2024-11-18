import type { FC } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define interfaces for our data structures
interface Worker {
  role: string;
  count: string;
}

interface WorkDescriptions {
  [key: number]: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
  },
  header: {
    border: '1px solid black',
    marginBottom: 10,
    flexDirection: 'row',
  },
  leftSection: {
    width: '30%',
    padding: 5,
    borderRight: '1px solid black',
  },
  middleSection: {
    width: '40%',
    padding: 5,
    alignItems: 'center',
    borderRight: '1px solid black',
  },
  rightSection: {
    width: '30%',
    padding: 5,
  },
  dateRow: {
    flexDirection: 'row',
    borderLeft: '1px solid black',
    borderRight: '1px solid black',
    borderBottom: '1px solid black',
  },
  dateCell: {
    padding: 5,
    flex: 1,
  },
  table: {
    marginTop: 10,
    border: '1px solid black',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid black',
    minHeight: 20,
  },
  tableCell: {
    padding: 5,
    flex: 1,
    borderRight: '1px solid black',
  },
  tableCellNoBorder: {
    padding: 5,
    flex: 1,
  },
  workItemCell: {
    padding: 5,
    flex: 2,
    borderRight: '1px solid black',
  },
  numberCell: {
    padding: 5,
    width: '10%',
    borderRight: '1px solid black',
  },
  boldText: {
    fontWeight: 'bold',
  },
  weatherTable: {
    marginTop: 10,
    border: '1px solid black',
  },
  materialSection: {
    marginTop: 10,
    border: '1px solid black',
  },
  issuesSection: {
    marginTop: 10,
    border: '1px solid black',
    minHeight: 100,
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerColumn: {
    width: '30%',
    alignItems: 'center',
  },
});

const getWorkDescription = (index: number): string => {
  const descriptions: WorkDescriptions = {
    1: "Pekerjaan pemasangan brickwall walltreatment WT.06",
    2: "Pekerjaan penarikan instalasi listrik",
    3: "Pekerjaan piping & wiring instalasi listrik lampu",
    4: "Pekerjaan compound single sided gypsum partition P.1",
    5: "Pekerjaan pemasangan pintu D.1",
    6: "Pekerjaan pemasangan kaca tempered GL.01 ruang meeting 1",
    7: "Pekerjaan pemasangan list pertemuan lantai",
    8: "Pekerjaan pemasangan pintu ruang lab D.2",
    9: "Pekerjaan pabrikasi decorative ceiling",
    10: "Pekerjaan pemasangan rangka plafond pantry",
    11: "Pekerjaan pembongkaran keramik existing koridor",
    12: "Pekerjaan pengecatan cover kolom PT.04",
    13: "Pekerjaan pengecatan PT.04",
    14: "Pekerjaan instalasi pipa ac"
  };
  return descriptions[index] || "";
};

const ReportTemplate: FC = () => (
  <Document>
    <Page size="LEGAL" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text>Nomor: 116</Text>
          <Text>Kontraktor:</Text>
          <Text>PT. Graha Sarana Duta</Text>
        </View>
        <View style={styles.middleSection}>
          <Text style={styles.boldText}>LAPORAN HARIAN</Text>
        </View>
        <View style={styles.rightSection}>
          <Text>Telkom DTV ADMEDIKA,</Text>
          <Text>IPTV (ex. Pins), KAP &</Text>
          <Text>AVATAR</Text>
        </View>
      </View>

      {/* Date Row */}
      <View style={styles.dateRow}>
        <View style={[styles.dateCell, { borderRight: '1px solid black' }]}>
          <Text>Tanggal: 02/09/2024</Text>
        </View>
        <View style={styles.dateCell}>
          <Text>Lampiran: Dokumentasi</Text>
        </View>
      </View>

      {/* Work Items Table */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.boldText}>Tenaga Kerja</Text>
          </View>
          <View style={styles.numberCell}>
            <Text style={styles.boldText}>No.</Text>
          </View>
          <View style={styles.workItemCell}>
            <Text style={styles.boldText}>Pekerjaan Hari Ini</Text>
          </View>
        </View>
        
        {/* Management Section */}
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text>I. Manajemen</Text>
          </View>
          <View style={styles.numberCell}>
            <Text>1</Text>
          </View>
          <View style={styles.workItemCell}>
            <Text>Pekerjaan pemasangan brickwall walltreatment WT.06</Text>
          </View>
        </View>

        {/* Work Items */}
        {["Project Manager", "Site Manager", "Site Engineer", "Admin Project", "Drafter"].map((item: string, index: number) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>{`${index + 1}. ${item}`}</Text>
            </View>
            <View style={styles.numberCell}>
              <Text>{index + 2}</Text>
            </View>
            <View style={styles.workItemCell}>
              <Text>{getWorkDescription(index + 2)}</Text>
            </View>
          </View>
        ))}

        {/* Field Workers Section */}
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text>II. Lapangan</Text>
          </View>
          <View style={styles.numberCell}>
            <Text>10</Text>
          </View>
          <View style={styles.workItemCell}>
            <Text>Pekerjaan pemasangan rangka plafond pantry</Text>
          </View>
        </View>

        {/* Field Workers Items */}
        {[
          { role: "Pekerja Sipil", count: "10 org" },
          { role: "Pekerja Arsitektur", count: "8 org" },
          { role: "Pekerja Mekanikal Elektrikal", count: "4 org" },
          { role: "Pekerja Furnitur", count: "3 org" },
        ].map((worker: Worker, index: number) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>{`${index + 1}. ${worker.role}`}</Text>
              <Text>{worker.count}</Text>
            </View>
            <View style={styles.numberCell}>
              <Text>{index + 11}</Text>
            </View>
            <View style={styles.workItemCell}>
              <Text>{getWorkDescription(index + 11)}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Weather Table */}
      <View style={styles.weatherTable}>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text>Cuaca</Text>
          </View>
          <View style={styles.tableCell}>
            <Text>Cerah</Text>
          </View>
          <View style={styles.tableCell}>
            <Text>Gerimis (Waktu)</Text>
          </View>
          <View style={styles.tableCellNoBorder}>
            <Text>Hujan (Waktu)</Text>
          </View>
        </View>
        {['Pagi', 'Siang', 'Sore', 'Malam'].map((time: string) => (
          <View key={time} style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>{time}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>✓</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>s/d</Text>
            </View>
            <View style={styles.tableCellNoBorder}>
              <Text>s/d</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Materials Section */}
      <View style={styles.materialSection}>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text>Material Diterima</Text>
          </View>
          <View style={styles.tableCell}>
            <Text>Volume</Text>
          </View>
          <View style={styles.tableCell}>
            <Text>Material Ditolak</Text>
          </View>
          <View style={styles.tableCellNoBorder}>
            <Text>Volume</Text>
          </View>
        </View>
        {[1, 2, 3, 4, 5].map((i: number) => (
          <View key={i} style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text></Text>
            </View>
            <View style={styles.tableCell}>
              <Text></Text>
            </View>
            <View style={styles.tableCell}>
              <Text></Text>
            </View>
            <View style={styles.tableCellNoBorder}>
              <Text></Text>
            </View>
          </View>
        ))}
      </View>

      {/* Issues Section */}
      <View style={styles.issuesSection}>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { flex: 1 }]}>
            <Text>Permasalahan yang timbul</Text>
          </View>
          <View style={[styles.tableCellNoBorder, { flex: 1 }]}>
            <Text>Penyelesaian</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerColumn}>
          <Text>Dilaporkan Oleh,</Text>
          <Text>Kontraktor Pelaksana</Text>
          <Text>PT Graha Sarana Duta</Text>
          <Text style={{ marginTop: 40 }}>Site Manager</Text>
        </View>
        <View style={styles.footerColumn}>
          <Text>Konsultan Pengawas</Text>
          <Text>PT Multi Reka Indonesia</Text>
          <Text style={{ marginTop: 40 }}>Adam Rivansyah</Text>
          <Text>Site Supervisor</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default ReportTemplate;