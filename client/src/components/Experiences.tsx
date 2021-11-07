import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createExperience, deleteExperience, getExperiences, patchExperience } from '../api/experiences-api'
import Auth from '../auth/Auth'
import { Experience } from '../types/Experience'

interface ExperiencesProps {
  auth: Auth
  history: History
}

interface ExperiencesState {
  experiences: Experience[]
  newExperienceFoodDetails: string
  loadingExperiences: boolean
}

export class Experiences extends React.PureComponent<ExperiencesProps, ExperiencesState> {
  state: ExperiencesState = {
    experiences: [],
    newExperienceFoodDetails: '',
    loadingExperiences: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newExperienceFoodDetails: event.target.value })
  }

  onEditButtonClick = (experienceId: string) => {
    this.props.history.push(`/experiences/${experienceId}/edit`)
  }

  onExperienceCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newExperience = await createExperience(this.props.auth.getIdToken(), {
        foodDetails: this.state.newExperienceFoodDetails,
        location:"",
        review:""
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

  onTodoCheck = async (pos: number) => {
    // try {
    //   const todo = this.state.experiences[pos]
    //   await patchExperience(this.props.auth.getIdToken(), todo.experienceId, {
    //     name: todo.foodDetails,
    //     dueDate: todo.location,
    //     done: !todo.review
    //   })
    //   this.setState({
    //     experiences: update(this.state.experiences, {
    //       [pos]: { review: { $set: !todo.review } }
    //     })
    //   })
    // } catch {
    //   alert('Todo deletion failed')
    // }
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
        <Header as="h1">Experiences</Header>

        {this.renderCreateExperienceInput()}

        {this.renderExperiences()}
      </div>
    )
  }

  renderCreateExperienceInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onExperienceCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderExperiences() {
    if (this.state.loadingExperiences) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.experiences.map((todo, pos) => {
          return (
            <Grid.Row key={todo.experienceId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={todo.review}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {todo.foodDetails}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {todo.location}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.experienceId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onExperienceDelete(todo.experienceId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {todo.attachmentUrl && (
                <Image src={todo.attachmentUrl} size="small" wrapped />
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

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
