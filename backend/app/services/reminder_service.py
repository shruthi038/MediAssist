from datetime import time
from typing import List, Dict, Optional
from app.db.models.medicine import Medicine
from app.db.models.reminder import Reminder

class ReminderService:
    # Centralized dictionary for schedule mapping
    # Maps lowercase normalized string keys to a list of times or None for manual
    SCHEDULE_RULES: Dict[str, Optional[List[time]]] = {
        "once daily": [time(9, 0)],
        "twice daily": [time(9, 0), time(21, 0)],
        "three times daily": [time(8, 0), time(14, 0), time(20, 0)],
        "every 6 hours": [time(6, 0), time(12, 0), time(18, 0), time(0, 0)],
        "every 8 hours": [time(8, 0), time(16, 0), time(0, 0)],
        "at bedtime": [time(22, 0)],
        "before breakfast": [time(7, 0)],
        "after meals": [time(9, 0), time(14, 0), time(20, 0)],
        "as needed": None
    }

    @classmethod
    def determine_schedule(cls, frequency: Optional[str], instructions: Optional[str]) -> Optional[List[time]]:
        """
        Determines the schedule based on frequency and instructions.
        Returns a list of times if confident, or None if it should be manual.
        """
        freq_str = (frequency or "").lower().strip()
        instr_str = (instructions or "").lower().strip()
        
        # Check against rules. We check explicit matches to avoid guessing.
        for key, times in cls.SCHEDULE_RULES.items():
            if key in freq_str or key in instr_str:
                return times
                
        # If no confident match is found (e.g. "every alternate day", empty, etc), return None (manual)
        return None

    @classmethod
    def generate_reminders(cls, medicine: Medicine, user_id: str, prescription_id: str) -> List[Reminder]:
        """
        Generates Reminder objects for a given Medicine.
        Does not interact directly with the database.
        """
        times = cls.determine_schedule(medicine.frequency, medicine.special_instructions)
        reminders = []
        
        if times is None:
            # Create a single manual reminder
            reminders.append(
                Reminder(
                    user_id=user_id,
                    prescription_id=prescription_id,
                    medicine_id=medicine.id,
                    medicine_name=medicine.name,
                    frequency=medicine.frequency,
                    dose_description=medicine.dosage,
                    reminder_time=None,
                    reminder_type="manual",
                    status="manual"
                )
            )
        else:
            # Create an automatic reminder for each time slot
            for t in times:
                reminders.append(
                    Reminder(
                        user_id=user_id,
                        prescription_id=prescription_id,
                        medicine_id=medicine.id,
                        medicine_name=medicine.name,
                        frequency=medicine.frequency,
                        dose_description=medicine.dosage,
                        reminder_time=t,
                        reminder_type="auto",
                        status="active"
                    )
                )
                
        return reminders
