import type { FC } from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import BirawaLogo from "@/assets/BirawaLogo.png";

// Define interfaces for our data structures

// interface WorkDescriptions {
//   [key: number]: string;
// }

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
  },
  header: {
    border: '1px solid black',
    marginBottom: 10,
    flexDirection: 'row',
    display:'flex',
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
    border : '1px solid black',
  },
  dateCell: {
    padding: 5,
    flex: 1,
  },
   // New styles for workforce table
   workforceTable: {
    marginTop: 10,
    border: '1px solid black',
  },
  shiftRow: {
    flexDirection: 'row',
    borderBottom: '1px solid black',
    marginBottom: 5,
  },
  shiftCell: {
    flex: 1,
    padding: 5,
    borderRight: '1px solid black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  workforceHeaderRow: {
    flexDirection: 'row',
    borderBottom: '1px solid black',
  },
  workforceHeaderCell: {
    flex: 3,
    padding: 5,
    borderRight: '1px solid black',
    fontWeight: 'bold',
  },
  workforceCountCell: {
    flex: 1,
    padding: 5,
    borderRight: '1px solid black',
    fontWeight: 'bold',
  },
  workforceRow: {
    flexDirection: 'row',
    minHeight: 20,
  },
  workforceCell: {
    flex: 3,
    padding: 5,
    borderRight: '1px solid black',
  },
  workforceNumberCell: {
    flex: 1,
    padding: 5,
    borderRight: '1px solid black',
    textAlign: 'center',
  },
  subtotalRow: {
    flexDirection: 'row',
    borderTop: '1px solid black',
  },
  totalRow: {
    flexDirection: 'row',
    borderTop: '1px solid black',
  },

  // Styles for daily activities table
  activitiesTable: {
    marginTop: 20,
    border: '1px solid black',
  },
  activityHeaderRow: {
    flexDirection: 'row',
    borderBottom: '1px solid black',
    backgroundColor: '#f0f0f0',
  },
  activityRow: {
    flexDirection: 'row',
    borderBottom: '1px solid black',
    minHeight: 25,
  },
  numberCell: {
    width: '10%',
    padding: 5,
    borderRight: '1px solid black',
    textAlign: 'center',
  },
  activityCell: {
    flex: 1,
    padding: 5,
    borderRight: '1px solid black',
  },
  boldText: {
    fontWeight:'bold',
  },
  categoryRow: {
    flexDirection: 'row',
    minHeight: 20,
    backgroundColor: '#ffffff',
  },
  categoryCell: {
    flex: 3,
    padding: 5,
    borderRight: '1px solid black',
    fontWeight: 'bold',
  },
  categoryNumberCell: {
    flex: 1,
    padding: 5,
    borderRight: '1px solid black',
    textAlign: 'center',
  },
  indentedCell: {
    flex: 3,
    paddingLeft: 10, // Added indentation
    borderRight: '1px solid black',
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
    flex: 1,
    padding: 5,
    borderRight: '1px solid black',
    textAlign: 'center',
  },
  tableCellNoBorder: {
    padding: 5,
    flex: 1,
    textAlign: 'center'
  },
  workItemCell: {
    padding: 5,
    flex: 2,
    borderRight: '1px solid black',
  },
  weatherTable: {
    marginTop: 20,
    border: '1px solid black',
  },
  materialSection: {
    marginTop: 20,
    border: '1px solid black',
    break: 'before',
  },
  issuesSection: {
    marginTop: 50,
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

  //style for image
  imagePage: {
    padding: 20,
    fontSize: 10,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20, // Jarak antar baris
  },
  imageCell: {
    width: '48%', // Lebar setiap gambar (dua kolom)
    alignItems: 'center', // Tengah secara horizontal
  },
  image: {
    width: 150,
    height: 100, // Atur tinggi gambar
    marginBottom: 5, // Jarak antara gambar dan teks
  },
  imageText: {
    textAlign: 'center',
  },  
  pageWithBorder: {
    padding: 20,
    fontSize: 10,
    border: '1px solid black', // Border di sekeliling halaman
  },
  contentWithBorder: {
    border: '1px solid black', // Border di sekitar konten
    padding: 10, // Memberikan jarak antara border dan konten
  },
});

// const getWorkDescription = (index: number): string => {
//   const descriptions: WorkDescriptions = {
//     1: "Pekerjaan pemasangan brickwall walltreatment WT.06",
//     2: "Pekerjaan penarikan instalasi listrik",
//     3: "Pekerjaan piping & wiring instalasi listrik lampu",
//     4: "Pekerjaan compound single sided gypsum partition P.1",
//     5: "Pekerjaan pemasangan pintu D.1",
//     6: "Pekerjaan pemasangan kaca tempered GL.01 ruang meeting 1",
//     7: "Pekerjaan pemasangan list pertemuan lantai",
//     8: "Pekerjaan pemasangan pintu ruang lab D.2",
//     9: "Pekerjaan pabrikasi decorative ceiling",
//     10: "Pekerjaan pemasangan rangka plafond pantry",
//     11: "Pekerjaan pembongkaran keramik existing koridor",
//     12: "Pekerjaan pengecatan cover kolom PT.04",
//     13: "Pekerjaan pengecatan PT.04",
//     14: "Pekerjaan instalasi pipa ac"
//   };
//   return descriptions[index] || "";
// };

const ReportTemplate: FC = () => (
  <Document>
    <Page size="A4" style={styles.page}>
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

     
      {/* Workforce Table */}
      <View style={styles.workforceTable}>
        <View style={styles.shiftRow}>
          <View style={styles.shiftCell}>
            <Text>SHIFT 1</Text>
          </View>
          <View style={styles.shiftCell}>
            <Text>SHIFT 2</Text>
          </View>
        </View>
        
        {/* Column Headers */}
        <View style={styles.workforceHeaderRow}>
          <View style={styles.workforceHeaderCell}>
            <Text>Jenis Tenaga Kerja</Text>
          </View>
          <View style={styles.workforceCountCell}>
            <Text>Jumlah</Text>
          </View>
          <View style={styles.workforceHeaderCell}>
            <Text>Jenis Tenaga Kerja</Text>
          </View>
          <View style={styles.workforceCountCell}>
            <Text>Jumlah</Text>
          </View>
        </View>

        {/* Workforce Rows - Management */}
        <View style={styles.workforceRow}>
          <View style={styles.categoryCell}>
            <Text>I. Manajemen</Text>
          </View>
          <View style={styles.categoryNumberCell}>
            <Text></Text>
          </View>
          <View style={styles.categoryCell}>
            <Text>I. Manajemen</Text>
          </View>
          <View style={styles.categoryNumberCell}>
            <Text></Text>
          </View>
        </View>


        {/*  */}
        <View style={styles.workforceRow}>
          <View style={styles.indentedCell}>
            <Text>1. Project Manager Shift 1</Text>
          </View>
          <View style={styles.workforceNumberCell}>
            <Text>1</Text>
          </View>
          <View style={styles.indentedCell}>
            <Text>1. Project Manager Shift 2</Text>
          </View>
          <View style={styles.workforceNumberCell}>
            <Text>1</Text>
          </View>
        </View>

        <View style={styles.workforceRow}>
          <View style={styles.indentedCell}>
            <Text>2. Site Manager</Text>
          </View>
          <View style={styles.workforceNumberCell}>
            <Text>2</Text>
          </View>
          <View style={styles.indentedCell}>
            <Text></Text>
          </View>
          <View style={styles.workforceNumberCell}>
            <Text>2</Text>
          </View>
        </View>

        <View style={styles.workforceRow}>
          <View style={styles.categoryCell}>
            <Text>II. Lapangan</Text>
          </View>
          <View style={styles.categoryNumberCell}>
            <Text></Text>
          </View>
          <View style={styles.categoryCell}>
            <Text>II. Lapangan</Text>
          </View>
          <View style={styles.categoryNumberCell}>
            <Text></Text>
          </View>
        </View>

        <View style={styles.workforceRow}>
          <View style={styles.indentedCell}>
            <Text>1. Pekerja Sipil</Text>
          </View>
          <View style={styles.workforceNumberCell}>
            <Text>3</Text>
          </View>
          <View style={styles.indentedCell}>
            <Text>1. Pekerja Sipil</Text>
          </View>
          <View style={styles.workforceNumberCell}>
            <Text>4</Text>
          </View>
        </View>

        <View style={styles.workforceRow}>
          <View style={styles.indentedCell}>
            <Text>2. Pekerja Arsitektur</Text>
          </View>
          <View style={styles.workforceNumberCell}>
            <Text>5</Text>
          </View>
          <View style={styles.indentedCell}>
            <Text></Text>
          </View>
          <View style={styles.workforceNumberCell}>
            <Text></Text>
          </View>
        </View>
        {/* Add more workforce rows as needed */}

        {/* Subtotals */}
        <View style={styles.subtotalRow}>
          <View style={styles.workforceCell}>
            <Text style={styles.boldText}>Sub Total 1</Text>
          </View>
          <View style={styles.workforceNumberCell}>
            <Text>11</Text>
          </View>
          <View style={styles.workforceCell}>
            <Text style={styles.boldText}>Sub Total 2</Text>
          </View>
          <View style={styles.workforceNumberCell}>
            <Text>7</Text>
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalRow}>
          <View style={[styles.workforceCell, { flex: 14.7 }]}>
            <Text style={styles.boldText}>Total Pekerjaan Hari ini</Text>
          </View>
          <View style={[styles.workforceNumberCell, { flex: 2 }]}>
            <Text>18</Text>
          </View>
        </View>
      </View>

      {/* Daily Activities Table */}
      <View style={styles.activitiesTable}>
        {/* Header Row*/}
        <View style={styles.activityHeaderRow}>
          <View style={styles.numberCell}>
            <Text style={styles.boldText}>No.</Text>
          </View>
          <View style={styles.activityCell}>
            <Text style={styles.boldText}>Tipe Pekerjaan</Text>
          </View>
          <View style={styles.activityCell}>
            <Text style={styles.boldText}>Detail Aktivitas Pekerjaan</Text>
          </View>
        </View>
        {/* Activity rows */}
        {[
          { type: 'Sipil', activities: ['Pengukuran topografi, analisis tanah dan pengambilan data lapangan'] },
          { type: 'Arsitektur', activities: ['Membuat konsep awal desain bangunan, termasuk sketsa'] },
          { type: 'Furniture', activities: ['Mengikuti tren desain interior dan gaya furniture terkini'] },
          { type: 'Mekanikal', activities: ['Merancang mesin, alat atau komponen mekanik dengan menggunakan sofware'] },
        ].map((item, index) => (
          <View key={index} style={styles.activityRow}>
            {/* Number Column */}
            <View style={styles.numberCell}>
              <Text>{index + 1}.</Text>
            </View>
            {/* Tipe Pekerjaan Column */}
            <View style={styles.activityCell}>
              <Text>{item.type}</Text>
            </View>
            {/* Detail Aktivitas Pekerjaan Column */}
            <View style={[styles.activityCell, { flexDirection: 'column' }]}>
              {item.activities.map((activity, i) => (
                <Text key={i}>{activity}</Text>
              ))}
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
      <View wrap={false}>
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

    <Page size="A4" style={styles.page}>
      <View style={styles.contentWithBorder}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 20 }}>
          Lampiran: Dokumentasi Lapangan
        </Text>

        {/* Baris pertama */}
        <View style={styles.imageRow}>
          <View style={styles.imageCell}>
            <Image style={styles.image} src={BirawaLogo}  />
            <Text style={styles.imageText}>Logo Birawa</Text>
          </View>
          <View style={styles.imageCell}>
            <Image style={styles.image} src={BirawaLogo} />
            <Text style={styles.imageText}>Logo Birawa</Text>
          </View>
        </View>

        {/* Baris kedua */}
        <View style={styles.imageRow}>
          <View style={styles.imageCell}>
            <Image style={styles.image} src={BirawaLogo} />
            <Text style={styles.imageText}>Logo Telkom Property</Text>
          </View>
          <View style={styles.imageCell}>
            <Image style={styles.image} src={BirawaLogo} />
            <Text style={styles.imageText}>Logo Telkom Property</Text>
          </View>
        </View>

        {/* Baris pertama */}
        <View style={styles.imageRow}>
          <View style={styles.imageCell}>
            <Image style={styles.image} src={BirawaLogo} />
            <Text style={styles.imageText}>Logo Telkom Property</Text>
          </View>
          <View style={styles.imageCell}>
            <Image style={styles.image} src={BirawaLogo} />
            <Text style={styles.imageText}>Logo Telkom Property</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default ReportTemplate;