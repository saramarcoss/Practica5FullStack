import gql from 'graphql-tag';

export const GET_AVAILABLE_SLOTS = gql`
    query GetAvailableSlots($day: Int!, $month: Int!, $year: Int!) {
        availableSlots(day: $day, month: $month, year: $year) {
            day
            month
            year
            hour
            available
        }
    }
`;

export const BOOK_SLOT = gql`
    mutation BookSlot($day: Int!, $month: Int!, $year: Int!, $hour: Int!, $dni: String!) {
        bookSlot(day: $day, month: $month, year: $year, hour: $hour, dni: $dni) {
            day
            month
            year
            hour
            available
            dni
        }
    }
`;

export const ADD_SLOT = gql`
    mutation AddSlot($day: Int!, $month: Int!, $year: Int!, $hour: Int!) {
        addSlot(day: $day, month: $month, year: $year, hour: $hour) {
            day
            month
            year
            hour
            available
        }
    }
`;

export const REMOVE_SLOT = gql`
    mutation RemoveSlot($day: Int!, $month: Int!, $year: Int!, $hour: Int!) {
        removeSlot(day: $day, month: $month, year: $year, hour: $hour) {
            day
            month
            year
            hour
            available
        }
    }
`;
