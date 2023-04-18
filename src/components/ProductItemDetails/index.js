// Write your code here

import './index.css'

import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItemDetailsList: [],
    similarProductsList: [],
    quantityCount: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductsItemDetails()
  }

  getProductsItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    console.log(response)

    if (response.ok === true) {
      const fetchedData = await response.json()

      const updatedData = {
        title: fetchedData.title,
        brand: fetchedData.brand,
        price: fetchedData.price,
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        rating: fetchedData.rating,
        description: fetchedData.description,
        totalReviews: fetchedData.total_reviews,
        available: fetchedData.availability,
      }

      const similarProducts = fetchedData.similar_products.map(eachSimilar => ({
        brand: eachSimilar.brand,
        id: eachSimilar.id,
        imageUrl: eachSimilar.image_url,
        title: eachSimilar.title,
        rating: eachSimilar.rating,
        totalReviews: eachSimilar.total_reviews,
        price: eachSimilar.price,
      }))

      this.setState({similarProductsList: similarProducts})

      this.setState({
        productItemDetailsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onIncreaseCount = () => {
    this.setState(prevState => ({quantityCount: prevState.quantityCount + 1}))
  }

  onDecreaseCount = () => {
    const {quantityCount} = this.state

    if (quantityCount > 1) {
      this.setState(prevState => ({quantityCount: prevState.quantityCount - 1}))
    }
  }

  renderProductItemDetails = () => {
    const {
      productItemDetailsList,
      similarProductsList,
      quantityCount,
    } = this.state
    console.log(similarProductsList)
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      available,
      brand,
    } = productItemDetailsList

    return (
      <div className="bg-container">
        <div className="details-container">
          <img
            src={imageUrl}
            alt="product"
            className="big-img"
            key={imageUrl}
          />
          <div className="name-and-extra">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}</p>
            <div className="rate-and-review">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="total-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="available">
              Available: <p className="span-text">{available}</p>
            </p>
            <p className="available">
              Brand: <p className="span-text">{brand}</p>
            </p>
            <hr className="hr-line" />
            <div className="quantity-container">
              <div className="count-container">
                <button
                  type="button"
                  className="btn"
                  onClick={this.onDecreaseCount}
                  data-testid="minus"
                >
                  <BsDashSquare />
                </button>
                <p className="count">{quantityCount}</p>
                <button
                  type="button"
                  className="btn"
                  onClick={this.onIncreaseCount}
                  data-testid="plus"
                >
                  <BsPlusSquare />
                </button>
              </div>
              <button type="button" className="add-to-cart-btn">
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="similar-heading">Similar Products</h1>
          <ul className="similar-products-list">
            {similarProductsList.map(similarProduct => (
              <li className="product-item" key={similarProduct.id}>
                <img
                  src={similarProduct.imageUrl}
                  alt="similar product"
                  className="thumbnail"
                />
                <h1 className="title">{similarProduct.title}</h1>
                <p className="brand">by {similarProduct.brand}</p>
                <div className="product-details">
                  <p className="price">Rs {similarProduct.price}/-</p>
                  <div className="rating-container">
                    <p className="rating">{similarProduct.rating}</p>
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                      alt="star"
                      className="star"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Product Not Found</h1>
      <Link to="/products" className="link-item-failure-view">
        <button type="button" className="failure-btn">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductsDetailsViews = apiStatus => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderProductItemDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {apiStatus} = this.state

    return (
      <div className="bg-container">
        <Header />
        {this.renderProductsDetailsViews(apiStatus)}
      </div>
    )
  }
}

export default ProductItemDetails
