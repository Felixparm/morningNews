import React, {useState, useEffect} from 'react';
import './App.css';
import { Card, Icon, Modal} from 'antd';
import Nav from './Nav'
import {connect} from 'react-redux'
import { useParams } from "react-router";

const { Meta } = Card;

function ScreenArticlesBySource(props) {


  const [articleList, setArticleList] = useState([])

  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  console.log(useParams())
  var id=useParams();
  useEffect(() => {
    const findArticles = async() => {
      const data = await fetch(`https://newsapi.org/v2/top-headlines?sources=${id.id}&apiKey=189771adbd2f40d4a27117edd90ff089`)
      const body = await data.json()
      console.log(body)
      setArticleList(body.articles) 
    }

    findArticles()    
  },[])
var addArticletoBDD = async function (token,article)  { 
    const data = await fetch('/wishlist',{ 
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: `tokenFromFront=${token}&titleFromFront=${article.title}&descriptionFromFront=${article.description}&contentFromFront=${article.content}&urlFromFront=${article.urlToImage}`
  }
  ) 
props.addToWishList(article);
}

  
  
 




  var showModal = (title, desc) => {
    setVisible(true)
    setTitle(title)
    setContent(desc)

  }

  var handleOk = e => {
    console.log(e)
    setVisible(false)
  }

  var handleCancel = e => {
    console.log(e)
    setVisible(false)
  }

  return (
    <div>
         
            <Nav/>

            <div className="Banner"/>

            <div className="Card">
              {articleList.map((article,i) => (
                <div key={i} style={{display:'flex',justifyContent:'center'}}>

                <Card
                  
                  style={{ 
                  width: 300, 
                  margin:'15px', 
                  display:'flex',
                  flexDirection: 'column',
                  justifyContent:'space-between' }}
                  cover={
                  <img
                      alt="example"
                      src={article.urlToImage}
                  />
                  }
                  actions={[
                      <Icon type="read" key="ellipsis2" onClick={() => showModal(article.title,article.description)} />,
                      <Icon type="like" key="ellipsis" onClick={()=> addArticletoBDD(props.token,article)} />
                    
                      
                  ]}
                  >

                  <Meta
                    title={article.title}
                    description={article.description}
                  />

                </Card>
                <Modal
                  title={title}
                  visible={visible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                >
                  <p>{title}</p>
                </Modal>

              </div>

              ))}
           </div> 

         
      
      </div>
  );
}

function mapDispatchToProps(dispatch){
  return {
    addToWishList: function(article){
      dispatch({type: 'addArticle',
        articleLiked: article
      })
    }
  }
}

function mapStateToProps(state){
  return {token: state.token}
}




export default connect(

  mapStateToProps,
  mapDispatchToProps
  
)(ScreenArticlesBySource)
