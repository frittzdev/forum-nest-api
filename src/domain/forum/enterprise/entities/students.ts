import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface StudentsProps {
  name: string
  email: string
  password: string
}

export class Students extends Entity<StudentsProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  static create(props: StudentsProps, id?: UniqueEntityId) {
    const student = new Students(props, id)

    return student
  }
}
