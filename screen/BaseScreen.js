



import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, FlatList, Text, TextInput } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import AwesomeAlert from 'react-native-awesome-alerts';
import { EmployessBottomAddUser, EmployesTablesHeader, ProgressText, TextButton_, UrlAll } from './Config';
import { baseScreenStyles } from './Styles_';
import { BottomSheet } from 'react-native-btr';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
const axios = require('axios');

export default class Employees extends Component {
  constructor(props) {
    super(props);
    /****************************************************************************************************************************************************** */
    /**************                           STATETE'LERİMİ TANIMLADIM                                                       **************************/
    /****************************************************************************************************************************************************** */
    this.state = {
      widthArr: [250, 150, 150, 100],
      pageStart: 0,
      pageTarget: 0,
      pageTotal: 0,
      pageSeperator: [],
      tableData: [],
      pageButtonColor: "",
      pageClick: 0,
      paramProgress: false,
      visibleBottomInsert: false,
      visibleBottomUpDel: false,
      inputFisrtName: "",
      inputLastName: "",
      inputUuid: "",
      inputDepartmentName: "",
      paramAlert: false,
      paramAlertinfo: '',
      paramAlertMsg: '',
      messageOperation: 0
    }
  }

  /****************************************************************************************************************************************************** */
  /************** SAYFA RENDER EDİLDİKTEN SONRA __dataStart Methodu İLE İLK LİSTEYİ ÇEKİYORUM                                **************************/
  /****************************************************************************************************************************************************** */
  componentDidMount() {
    this.setState({ paramProgress: true })
    this.__dataStart("1")
  }

  /****************************************************************************************************************************************************** */
  /************** LİSTENİN İLK KEZ YÜKLENDİĞİ METHOD. DİĞER İŞLEMLERDEN (İNSERT,UPDATE,DELETE) SONRA BU METODU TEKRAR ÇAĞIRIYORUM.
   * DOLAYISI İLE METOD HER ÇALIŞTIĞINDA GÖSTERMESİ GEREKEN SAYFAYI 
   * (page)  DEĞİŞKENİNE PARAMETRE OLARAK GEÇİYORUM VE METODUN İÇERİSİNDE TOPLAM ELEMAN SAYISI TOPLAM SAYFA SAYISI GİBİ HESAPLAMALARI HER SEFERİNDE TEKRAR YAPIYORUM                                                                         **************************/
  /****************************************************************************************************************************************************** */
  __dataStart(page) {

    //LOGİN SAYFASINDA ELDE ETTİĞİMİZ VERİLERİ PROPS İLE BU SAYFAYA TAŞIYORUM

    console.log(this.props.route.params.data[5][1])//uuid

    var self = this
    console.log(this.state.pageTotal)


    var config = {
      url: UrlAll.UrlEmployessGetAllUser + page,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.props.route.params.data[5][1]
      }
    };

    axios(config)
      .then(function (response) {

        let jsondata_parser = JSON.parse(JSON.stringify(response.data));
        let sayfaToplam = jsondata_parser.meta.total / jsondata_parser.meta.per_page | 0 //% 2 ? +1 : +0
        let sayfaKalan = jsondata_parser.meta.total - (sayfaToplam * jsondata_parser.meta.per_page) //% 2 ? +1 : +0
        let say = sayfaKalan > 0 ? sayfaToplam + 1 : sayfaToplam
        const dinamiPageNumber = []
        for (let index = 1; index <= say; index++) {
          dinamiPageNumber.push({
            id: index,
            page: index
          })
        }

        const tableDataDinamik = [];

        jsondata_parser.data.map((val) => {
          const rowData = [];
          rowData.push(val.uuid, val.first_name, val.last_name, val.department);
          tableDataDinamik.push(rowData);
        }
        )

        self.setState(
          {
            pageSeperator: dinamiPageNumber,
            pageTotal: jsondata_parser.meta.total,
            pageStart: page < say ? (page - 1 < 1 ? "1" : (page * jsondata_parser.meta.per_page) - jsondata_parser.meta.per_page) : ((page - 1) * jsondata_parser.meta.per_page),
            pageTarget: page < say ? page * jsondata_parser.meta.per_page : jsondata_parser.meta.total,
            pageClick: page,
            pageClickTemp: page,
            tableData: tableDataDinamik,
            paramProgress: false,
            pageTotalTemp: say,
            visibleBottomInsert: false,
          }
        )
        // messageOperation DEĞİŞKENİ DİNAMİK OLARAK SAYFA GÖRÜNTÜLEME VERİ SİLME,EKLEME,GÜNCELLEME GİBİ İŞLEMLERDE EKRANA NASIL BİR UYARI MESAJI VERİLECEĞİNİN STATUS UNU TUTUYOR
        setTimeout(() => {
          self.state.messageOperation === 0 ? '' : self.setState({ messageOperation: 0, paramAlert: true, paramAlertinfo: 'success', paramAlertMsg: self.state.messageOperation === 3 ? 'Kayıt Ekleme İşlemi Başarılı' : self.state.messageOperation === 1 ? 'Kayıt Silme İşlemi Başarılı' : 'Kayıt Güncelleme Başarılı' })
        }, 300);

      })
      .catch(function (error) {
        console.log(error)
        self.setState({ paramProgress: false })
        self.__messageError("Bir Hata Oluştu")
      });
  }

  __employessVisuallUser(param) {

    // UUİD VE TOKEN DEĞERİNE GÖRE GET YÖNTEMİNİ KULLANARAK KULLANICI BİLGİLERİNE ULAŞIYORUM.
    // VERİLER ELİMİZE ULAŞTIĞINDA GEREKLİ STATE'LERE GÜNCELLEME İŞLEMLERİNİ YAPIYOR VE BOTTOMSHİELDDİALOG (MODAL) NESNEMİZ ÜZERİNDE GÖSTERİRİYORUM
    var self = this
    self.setState({ paramProgress: true })

    var config = {
      url: UrlAll.UrlEmployessGetTargetUser + param[0],
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.props.route.params.data[5][1]
      }
    };

    axios(config)
      .then(function (response) {

        let jsondata_parser_ = JSON.parse(JSON.stringify(response.data));
        console.log(jsondata_parser_)

        self.setState({
          paramProgress: false,
          inputUuid: jsondata_parser_.data.uuid,
          inputFisrtName: jsondata_parser_.data.first_name,
          inputLastName: jsondata_parser_.data.last_name,
          inputDepartmentName: jsondata_parser_.data.department,
          visibleBottomUpDel: true
        })

      })
      .catch(function (error) {
        self.setState({ paramProgress: false })
        self.__messageError("Bir Hata Oluştu")
      });
  }
  // UUİD VE TOKEN DEĞERİNE GÖRE DELETE YÖNTEMİNİ KULLANARAK KULLANICI BİLGİLERİNİ SİLİYORUM.
  //VE DAHA ÖNCEDEN ELİMDE TUTTUĞUM TIKLANAN SON SAYFAYI    self.__dataStart(self.state.pageClick) ŞEKLİNDE
  // __dataStart METODUNA PARRAMETRE OLARAK GEÇİP LİSTENİN AYNI SAYFADA YENİLENMESİNİ SAĞLIYORUM

  __employessDeleteUser() {
    var self = this
    self.setState({ paramProgress: true })

    var config = {
      url: UrlAll.UrlEmployessGetDeleteUser + self.state.inputUuid,
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + this.props.route.params.data[5][1]
      }
    };

    axios(config)
      .then(function (response) {

        let jsondata_parser_ = JSON.parse(JSON.stringify(response.data));
        console.log(jsondata_parser_)
        self.setState({ visibleBottomUpDel: false, messageOperation: 1 })
        console.log(self.state.pageClick)

        self.__dataStart(self.state.pageClick)

      })
      .catch(function (error) {
        self.setState({ paramProgress: false })
        self.__messageError("Bir Hata Oluştu")
      });
  }

  // EKRANDA İŞLEM DURUM MESAJLARINI GÖSTEREN MESAJ METHODU.LÜTFEN BEKLEYİN PROĞRESS BARI KAPANDIĞINDA setTimeout İLE 200 MS LİK BİR GECİKME VERİYORUMKİ BU İKİ PENCERE ÜSTÜTE BİNMESİN

  __messageError(error) {
    setTimeout(() => {
      self.setState({ messageOperation: 0, paramAlert: true, paramAlertinfo: 'danger', paramAlertMsg: error })
    }, 200);
  }

  // YİNE DELETE METODUNDA OLDUĞU GİBİ UUİD VE TOKEN DEĞERLERİMİZE DÖRE POST YÖNTEMİNİ KULLANATAK MODAL'DAN ALINA VERİLERİN GÜNCELLEMESİNİ YAPIYORUM.
  // SONRASINDA YİNE __dataStart METODUNU ÇAĞIRIYORUM

  __employessUpdateUser() {
    var self = this
    self.setState({ paramProgress: true })

    console.log(UrlAll.UrlEmployessGetUpdateUser + self.state.inputUuid)
    console.log(this.state.inputFisrtName)
    console.log(this.state.inputLastName)
    var Data = {
      "first_name": this.state.inputFisrtName,
      "last_name": this.state.inputLastName
    };

    var config = {
      url: UrlAll.UrlEmployessGetUpdateUser + self.state.inputUuid,
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + this.props.route.params.data[5][1]
      },
      data: Data
    };

    axios(config)
      .then(function (response) {

        let jsondata_parser_ = JSON.parse(JSON.stringify(response.data));
        console.log(jsondata_parser_)
        self.setState({ visibleBottomUpDel: false, messageOperation: 2 })
        console.log(self.state.pageClick)

        self.__dataStart(self.state.pageClick)

      })
      .catch(function (error) {
        self.setState({ paramProgress: false })
        self.__messageError("Bir Hata Oluştu")
      });
  }

  // KULLANICILARIN SİSTEME İNSERT EDİLDİĞİ METOD. SAYFA YENİLENME OLAYI UPDATE VE DELETE YÖNTEMLERİNDEKİ GİBİ ÇALIŞIYOR
  __employessAddUser() {
    var self = this
    self.setState({ paramProgress: true })

    console.log(this.state.inputFisrtName)
    console.log(this.state.inputLastName)
    console.log(this.state.inputDepartmentName)
    var Data = {
      "first_name": this.state.inputFisrtName,
      "last_name": this.state.inputLastName,
      "department": this.state.inputDepartmentName,
    };

    var config = {
      url: UrlAll.UrlEmployessAddUser,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.props.route.params.data[5][1]
      },
      data: Data
    };

    axios(config)
      .then(function (response) {

        let jsondata_parser_ = JSON.parse(JSON.stringify(response.data));
        console.log(jsondata_parser_)
        self.setState({ paramProgress: false, messageOperation: 3 })
        console.log(self.state.pageTotalTemp)
        self.__dataStart(self.state.pageTotalTemp)

      })
      .catch(function (error) {
        self.setState({ paramProgress: false })
        self.__messageError("Bir Hata Oluştu")
      });
  }
  __handleClose = () => {
    this.state.paramAlert(false)
  }

  render() {

    // VE BURADAN AŞAĞISI GÖRSEL NESNELER. 

    const state = this.state;

    const ItemRender = ({ name }) => (
      <View style={baseScreenStyles.item}>
        <TouchableOpacity onPress={() => this.__dataStart(name)} style={[baseScreenStyles.touchable2, { backgroundColor: this.state.pageClick == name ? 'red' : '' }]}>
          <Text style={baseScreenStyles.itemText}>{name}</Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <View style={baseScreenStyles.container}>
        <View style={{ flex: 0.6 }}>
          <ScrollView horizontal={true}>
            <View style={baseScreenStyles.container}>

              <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                <Row data={EmployesTablesHeader} style={baseScreenStyles.header} widthArr={state.widthArr} textStyle={baseScreenStyles.textHeader} />
              </Table>

              <ScrollView style={baseScreenStyles.dataWrapper}>
                <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                  {
                    this.state.tableData.map((rowData, index) => (
                      <TouchableOpacity style={baseScreenStyles.touchable} onPress={() => this.__employessVisuallUser(rowData)}>
                        <Row
                          widthArr={state.widthArr}
                          key={index}
                          data={rowData}
                          style={index % 2 && { backgroundColor: '#2c3445' }}
                          textStyle={baseScreenStyles.textFooter}
                        />
                      </TouchableOpacity>
                    ))
                  }
                </Table>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
        <View style={{ padding: 10, flex: 0.4, justifyContent: 'space-between' }}>
          <View style={{ flex: 0.3, justifyContent: 'flex-end' }}>
            <TouchableOpacity>
              <Text> Toplam {this.state.pageTotal} kayıttan {this.state.pageStart} - {this.state.pageTarget} Arası gösteriliyor</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.3 }}>
            <FlatList
              onPress={() => alert('presss')}
              data={this.state.pageSeperator}
              renderItem={({ item }) => <ItemRender name={item.id} />}
              keyExtractor={item => item.id}
              horizontal={true} />
          </View>
          <View style={{ flex: 0.3 }}>
            <TouchableOpacity onPress={() => this.setState({ visibleBottomInsert: true })} style={baseScreenStyles.touchable3}>
              <Text style={{ textAlign: 'center', width: '100%', fontSize: 20 }}>create</Text>
            </TouchableOpacity>
          </View>
        </View>

        <AwesomeAlert
          show={this.state.paramProgress}
          showProgress={true}
          progressSize="large"
          message={ProgressText.labelPROGRESS_A}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
        />
        {/********************************************************** EMPLOYESS INSERT ******************************************************************/}
        <BottomSheet
          style={{ backgroundColor: '#E5E5E5' }}
          visible={this.state.visibleBottomInsert}>
          {/*Bottom Sheet inner View*/
            <View style={baseScreenStyles.bottomContent}>
              <View style={baseScreenStyles.cardShadow2} >

                <View style={baseScreenStyles.bottomInputText}>
                  <TouchableOpacity style={baseScreenStyles.touchStyle}>
                    <TextInput
                      style={baseScreenStyles.TextInput}
                      placeholder={EmployessBottomAddUser.labelPROGRESS_A}
                      onChangeText={(paramA) => this.setState({ inputFisrtName: paramA })}
                    />
                  </TouchableOpacity>
                </View>

                <View style={baseScreenStyles.bottomInputText}>
                  <TouchableOpacity style={baseScreenStyles.touchStyle}>
                    <TextInput
                      style={baseScreenStyles.TextInput}
                      placeholder={EmployessBottomAddUser.labelPROGRESS_B}
                      onChangeText={(paramB) => this.setState({ inputLastName: paramB })}
                    />
                  </TouchableOpacity>
                </View>

                <View style={baseScreenStyles.bottomInputText}>
                  <TouchableOpacity style={baseScreenStyles.touchStyle}>
                    <TextInput
                      style={baseScreenStyles.TextInput}
                      placeholder={EmployessBottomAddUser.labelPROGRESS_C}
                      onChangeText={(paramC) => this.setState({ inputDepartmentName: paramC })}
                    />
                  </TouchableOpacity>
                </View>

                <View style={{ padding: 5 }}>
                  <TouchableOpacity onPress={() => this.__employessAddUser()} style={baseScreenStyles.buttonStyle}>
                    <Text style={baseScreenStyles.buttonTextStyle}>{TextButton_.buttonKaydet}</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ padding: 5 }}>
                  <TouchableOpacity onPress={() => this.setState({ visibleBottomInsert: false })} style={baseScreenStyles.buttonStyle}>
                    <Text style={baseScreenStyles.buttonTextStyle}>{TextButton_.buttonVazgec}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }
        </BottomSheet>

        {/********************************************************** EMPLOYESS UPDATE DELETE ******************************************************************/}
        <BottomSheet
          style={{ backgroundColor: '#E5E5E5' }}
          visible={this.state.visibleBottomUpDel}>
          {/*Bottom Sheet inner View*/
            <View style={baseScreenStyles.bottomContent}>
              <View style={baseScreenStyles.cardShadow2} >

                <View style={baseScreenStyles.bottomInputText}>
                  <TouchableOpacity style={baseScreenStyles.touchStyle}>
                    <Text style={baseScreenStyles.TextInput}>Uuid :  {this.state.inputUuid}</Text>
                  </TouchableOpacity>
                </View>

                <View style={baseScreenStyles.bottomInputText}>
                  <TouchableOpacity style={baseScreenStyles.touchStyle}>
                    <TextInput
                      style={baseScreenStyles.TextInput}
                      placeholder={EmployessBottomAddUser.labelPROGRESS_A}
                      onChangeText={(paramA) => this.setState({ inputFisrtName: paramA })}
                    >{this.state.inputFisrtName}</TextInput>
                  </TouchableOpacity>
                </View>

                <View style={baseScreenStyles.bottomInputText}>
                  <TouchableOpacity style={baseScreenStyles.touchStyle}>
                    <TextInput
                      style={baseScreenStyles.TextInput}
                      placeholder={EmployessBottomAddUser.labelPROGRESS_B}
                      onChangeText={(paramB) => this.setState({ inputLastName: paramB })}
                    >{this.state.inputLastName}</TextInput>
                  </TouchableOpacity>
                </View>

                <View style={{ padding: 5 }}>
                  <TouchableOpacity onPress={() => this.__employessUpdateUser()} style={baseScreenStyles.buttonStyle}>
                    <Text style={baseScreenStyles.buttonTextStyle}>{TextButton_.buttonGuncelle}</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ padding: 5 }}>
                  <TouchableOpacity onPress={() => this.__employessDeleteUser()} style={baseScreenStyles.buttonStyle}>
                    <Text style={baseScreenStyles.buttonTextStyle}>{TextButton_.buttonSil}</Text>
                  </TouchableOpacity>
                </View>


                <View style={{ padding: 5 }}>
                  <TouchableOpacity onPress={() => this.setState({ visibleBottomUpDel: false })} style={baseScreenStyles.buttonStyle}>
                    <Text style={baseScreenStyles.buttonTextStyle}>{TextButton_.buttonKaydet}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }
        </BottomSheet>

        <SCLAlert
          show={this.state.paramAlert}
          theme={this.state.paramAlertinfo}
          onRequestClose={this.__handleClose}
          title={""}
          subtitle={this.state.paramAlertMsg}
          slideAnimationDuration={90}
          cancellable={false}>

          <SCLAlertButton theme="info" onPress={() => this.setState({ paramAlert: false })}>{TextButton_.buttonTamam}</SCLAlertButton>
        </SCLAlert>

      </View>
    )
  }
}