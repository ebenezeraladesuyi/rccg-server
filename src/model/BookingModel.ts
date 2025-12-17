import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
    name: string;
    email: string;
    contactNumber: string;
    proposedDate: Date;
    eventType: string;
    expectedGuests: number;
    eventStartTime: string;
    eventEndTime: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    additionalNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name cannot exceed 100 characters']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
        },
        contactNumber: {
            type: String,
            required: [true, 'Contact number is required'],
            trim: true,
            match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid contact number']
        },
        proposedDate: {
            type: Date,
            required: [true, 'Proposed date is required'],
            validate: {
                validator: function(value: Date) {
                    return value >= new Date();
                },
                message: 'Proposed date must be in the future'
            }
        },
        eventType: {
            type: String,
            required: [true, 'Event type is required'],
            trim: true,
            minlength: [2, 'Event type must be at least 2 characters'],
            maxlength: [100, 'Event type cannot exceed 100 characters']
        },
        expectedGuests: {
            type: Number,
            required: [true, 'Number of expected guests is required'],
            min: [1, 'At least 1 guest is required'],
            max: [300, 'Maximum 300 guests allowed']
        },
        eventStartTime: {
            type: String,
            required: [true, 'Event start time is required'],
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time in HH:MM format']
        },
        eventEndTime: {
            type: String,
            required: [true, 'Event end time is required'],
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time in HH:MM format'],
            validate: {
                validator: function(this: IBooking, value: string) {
                    return value > this.eventStartTime;
                },
                message: 'Event end time must be after start time'
            }
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'cancelled'],
            default: 'pending'
        },
        additionalNotes: {
            type: String,
            maxlength: [1000, 'Additional notes cannot exceed 1000 characters'],
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Add virtual for formatted date
BookingSchema.virtual('formattedDate').get(function(this: IBooking) {
    return this.proposedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Add virtual for duration
BookingSchema.virtual('duration').get(function(this: IBooking) {
    const start = parseInt(this.eventStartTime.split(':')[0]) * 60 + parseInt(this.eventStartTime.split(':')[1]);
    const end = parseInt(this.eventEndTime.split(':')[0]) * 60 + parseInt(this.eventEndTime.split(':')[1]);
    const durationMinutes = end - start;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}h ${minutes}m`;
});

// Pre-save middleware to update updatedAt
BookingSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Index for efficient queries
BookingSchema.index({ proposedDate: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ email: 1 });
BookingSchema.index({ createdAt: -1 });

export const BookingModel = mongoose.model<IBooking>('Booking', BookingSchema);