import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Loader,
  Item,
  Form
} from 'semantic-ui-react'

import { createExperience, deleteExperience, getExperiences } from '../api/experiences-api'
import Auth from '../auth/Auth'
import { Experience } from '../types/Experience'

interface ExperiencesProps {
  auth: Auth
  history: History
}

interface ExperiencesState {
  experiences: Experience[]
  newExperienceFoodDetails: string
  newExperienceLocation: string
  newExperienceReview: string
  loadingExperiences: boolean
}

export class Experiences extends React.PureComponent<ExperiencesProps, ExperiencesState> {
  state: ExperiencesState = {
    experiences: [],
    newExperienceFoodDetails: '',
    newExperienceLocation: '',
    newExperienceReview: '',
    loadingExperiences: true
  }

  handleFoodDetailsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ newExperienceFoodDetails: event.target.value })
  }

  handleLocationChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ newExperienceLocation: event.target.value })
  }

  handleReviewChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ newExperienceReview: event.target.value })
  }

  onEditButtonClick = (experienceId: string) => {
    this.props.history.push(`/experiences/${experienceId}/edit`)
  }

  onExperienceCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const newExperience = await createExperience(this.props.auth.getIdToken(), {
        foodDetails: this.state.newExperienceFoodDetails,
        location: this.state.newExperienceLocation,
        review: this.state.newExperienceReview
      })
      this.setState({
        experiences: [...this.state.experiences, newExperience],
        newExperienceFoodDetails: ''
      })
    } catch {
      alert('Experience creation failed')
    }
  }

  onExperienceDelete = async (experienceId: string) => {
    try {
      await deleteExperience(this.props.auth.getIdToken(), experienceId)
      this.setState({
        experiences: this.state.experiences.filter(experience => experience.experienceId !== experienceId)
      })
    } catch {
      alert('Experience deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const experiences = await getExperiences(this.props.auth.getIdToken())
      this.setState({
        experiences: experiences,
        loadingExperiences: false
      })
    } catch (e) {
      alert(`Failed to fetch experiences: ${JSON.stringify(e)}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Foodie Experiences</Header>

        {this.renderCreateExperienceInput()}

        {this.renderExperiences()}
      </div>
    )
  }

  renderCreateExperienceInput() {
    return (
      <Form>

        <Form.Field onChange={this.handleFoodDetailsChange}>
          <label>Food details</label>
          <input placeholder='What did you eat?' />
        </Form.Field>

        <Form.Field onChange={this.handleLocationChange}>
          <label>Location</label>
          <input placeholder='What is the location of the place?' />
        </Form.Field>

        <Form.TextArea
          label='Review'
          onChange={this.handleReviewChange}
          placeholder='What was the experience like?' />

        <Button type='submit'
          onClick={(e) => this.onExperienceCreate(e)} >Submit</Button>
      </Form>
    )

  }

  renderExperiences() {
    if (this.state.loadingExperiences) {
      return this.renderLoading()
    }

    return this.renderExperiencesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading EXPERIENCES
        </Loader>
      </Grid.Row>
    )
  }

  renderExperiencesList() {

    return (
      <Grid padded>
        <Grid.Row >
          <Grid.Column width={2} verticalAlign="middle">
            <b>Food</b>
          </Grid.Column>

          <Grid.Column width={2} verticalAlign="middle">
            <b>Location</b>
          </Grid.Column>

          <Grid.Column width={9} floated="left">
            <b>Review</b>
          </Grid.Column>

          <Grid.Column width={1} floated="right">
            <b>Action</b>
          </Grid.Column>

          <Grid.Column width={1} floated="right">
          </Grid.Column>

          <Grid.Column width={16}>
            <Divider />
          </Grid.Column>

        </Grid.Row>
        {this.state.experiences.map((experience, pos) => {
          return (
            <Grid.Row key={experience.experienceId}>
              <Grid.Column width={2} verticalAlign="middle">
                {experience.foodDetails}
              </Grid.Column>

              <Grid.Column width={2} verticalAlign="middle">
                {experience.location}
              </Grid.Column>

              <Grid.Column width={9} floated="left">
                {experience.review}
              </Grid.Column>

              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(experience.experienceId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>

              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onExperienceDelete(experience.experienceId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>

              {experience.attachmentUrl && (
                <Image src={experience.attachmentUrl} size="medium" wrapped />
              )}

              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>

            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

}
